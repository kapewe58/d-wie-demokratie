// Schreibt eine Bildfolge (r0000.jpg …) und Ton in EIN MP4 mit fester Datenrate (H.264 + AAC).
// Aufruf: swift kodieren2.swift <bilderordner> <ton.mp4> <ziel.mp4> <breite> <höhe> <videobitrate> <start:länge> [start:länge …]
// Der Ton wird aus <ton.mp4> zu den Startzeiten eingesetzt und in den letzten 0,5 s ausgeblendet.
import AVFoundation
import AppKit

let a = CommandLine.arguments
let ordner = a[1], tonDatei = a[2], ziel = a[3]
let W = Int(a[4])!, H = Int(a[5])!, bitrate = Int(a[6])!
let starts = a[7...].map { s -> (Double, Double) in let t = s.split(separator: ":"); return (Double(t[0])!, Double(t[1])!) }
let fps: Int32 = 24
let fm = FileManager.default
let bilder = try! fm.contentsOfDirectory(atPath: ordner).filter { $0.hasSuffix(".jpg") }.sorted()
let dauer = CMTime(value: CMTimeValue(bilder.count), timescale: fps)

// Ton zusammenstellen (Komposition + Ausblenden) und als PCM lesen
let comp = AVMutableComposition()
let tonAsset = AVURLAsset(url: URL(fileURLWithPath: tonDatei))   // muss am Leben bleiben, sonst ist die Spur ungültig
let quelle = tonAsset.tracks(withMediaType: .audio)[0]
let aTrack = comp.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid)!
var ende = 0.0   // bis hierhin ist die Tonspur gefüllt; Lücken werden als Stille eingefügt
for (s, l) in starts.sorted(by: { $0.0 < $1.0 }) {
  if s > ende { aTrack.insertEmptyTimeRange(CMTimeRange(start: CMTime(seconds: ende, preferredTimescale: 600), end: CMTime(seconds: s, preferredTimescale: 600))) }
  let len = min(l, CMTimeGetSeconds(dauer) - s)
  try! aTrack.insertTimeRange(CMTimeRange(start: .zero, duration: CMTime(seconds: len, preferredTimescale: 600)), of: quelle, at: CMTime(seconds: s, preferredTimescale: 600))
  ende = s + len
}
if ende < CMTimeGetSeconds(dauer) { aTrack.insertEmptyTimeRange(CMTimeRange(start: CMTime(seconds: ende, preferredTimescale: 600), end: dauer)) }
let p = AVMutableAudioMixInputParameters(track: aTrack)
p.setVolumeRamp(fromStartVolume: 1, toEndVolume: 0, timeRange: CMTimeRange(start: CMTimeSubtract(dauer, CMTime(seconds: 0.5, preferredTimescale: 600)), end: dauer))
let mix = AVMutableAudioMix(); mix.inputParameters = [p]
let reader = try! AVAssetReader(asset: comp)
reader.timeRange = CMTimeRange(start: .zero, duration: dauer)
let aOut = AVAssetReaderAudioMixOutput(audioTracks: [aTrack], audioSettings: [AVFormatIDKey: kAudioFormatLinearPCM, AVSampleRateKey: 44100, AVNumberOfChannelsKey: 2, AVLinearPCMBitDepthKey: 16, AVLinearPCMIsFloatKey: false, AVLinearPCMIsBigEndianKey: false])
aOut.audioMix = mix
reader.add(aOut)

// Schreiber
let zielURL = URL(fileURLWithPath: ziel)
try? fm.removeItem(at: zielURL)
let writer = try! AVAssetWriter(outputURL: zielURL, fileType: .mp4)
writer.shouldOptimizeForNetworkUse = true
let vIn = AVAssetWriterInput(mediaType: .video, outputSettings: [
  AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: W, AVVideoHeightKey: H,
  AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: bitrate, AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel, AVVideoMaxKeyFrameIntervalKey: 48]])
vIn.expectsMediaDataInRealTime = false
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: vIn, sourcePixelBufferAttributes: [
  kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32ARGB, kCVPixelBufferWidthKey as String: W, kCVPixelBufferHeightKey as String: H])
let aIn = AVAssetWriterInput(mediaType: .audio, outputSettings: [AVFormatIDKey: kAudioFormatMPEG4AAC, AVSampleRateKey: 44100, AVNumberOfChannelsKey: 2, AVEncoderBitRateKey: 128000])
aIn.expectsMediaDataInRealTime = false
writer.add(vIn); writer.add(aIn)
writer.startWriting(); writer.startSession(atSourceTime: .zero)
reader.startReading()

let gruppe = DispatchGroup()
gruppe.enter()
var i = 0
vIn.requestMediaDataWhenReady(on: DispatchQueue(label: "video")) {
  while vIn.isReadyForMoreMediaData {
    if i >= bilder.count { vIn.markAsFinished(); gruppe.leave(); return }
    let img = NSImage(contentsOfFile: ordner + "/" + bilder[i])!
    var r = CGRect(x: 0, y: 0, width: W, height: H)
    let cg = img.cgImage(forProposedRect: &r, context: nil, hints: nil)!
    var pb: CVPixelBuffer?
    CVPixelBufferPoolCreatePixelBuffer(nil, adaptor.pixelBufferPool!, &pb)
    CVPixelBufferLockBaseAddress(pb!, [])
    let ctx = CGContext(data: CVPixelBufferGetBaseAddress(pb!), width: W, height: H, bitsPerComponent: 8, bytesPerRow: CVPixelBufferGetBytesPerRow(pb!), space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue)!
    ctx.draw(cg, in: CGRect(x: 0, y: 0, width: W, height: H))
    CVPixelBufferUnlockBaseAddress(pb!, [])
    adaptor.append(pb!, withPresentationTime: CMTime(value: CMTimeValue(i), timescale: fps))
    i += 1
  }
}
gruppe.enter()
aIn.requestMediaDataWhenReady(on: DispatchQueue(label: "audio")) {
  while aIn.isReadyForMoreMediaData {
    if let sb = aOut.copyNextSampleBuffer() { aIn.append(sb) } else { aIn.markAsFinished(); gruppe.leave(); return }
  }
}
gruppe.wait()
let sem = DispatchSemaphore(value: 0)
writer.finishWriting { sem.signal() }; sem.wait()
print("Status", writer.status.rawValue, writer.error?.localizedDescription ?? "ok", "Bilder", bilder.count)
