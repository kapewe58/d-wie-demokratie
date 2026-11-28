// Aufruf: swift kodieren.swift <bilderordner> <ton.mp4> <ziel.mp4> <start:länge> [start:länge ...]
// Schreibt die JPGs (r0000.jpg …) als H.264-Video mit 24 Bildern/s und legt den Ton zu den Startzeiten an.
import AVFoundation
import AppKit

let args = CommandLine.arguments
let ordner = args[1], tonDatei = args[2], ziel = args[3]
let starts = args[4...].map { a -> (Double, Double) in let t = a.split(separator: ":"); return (Double(t[0])!, Double(t[1])!) }
let fps: Int32 = 24
let W = 1080, H = 1920
let fm = FileManager.default
let bilder = try! fm.contentsOfDirectory(atPath: ordner).filter { $0.hasSuffix(".jpg") }.sorted()

// 1) Nur Bild
let stumm = URL(fileURLWithPath: ziel + ".stumm.mp4")
try? fm.removeItem(at: stumm)
let writer = try! AVAssetWriter(outputURL: stumm, fileType: .mp4)
let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
  AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: W, AVVideoHeightKey: H,
  AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: 10_000_000, AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel]])
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: [
  kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32ARGB, kCVPixelBufferWidthKey as String: W, kCVPixelBufferHeightKey as String: H])
writer.add(input); writer.startWriting(); writer.startSession(atSourceTime: .zero)
for (i, name) in bilder.enumerated() {
  let img = NSImage(contentsOfFile: ordner + "/" + name)!
  var rect = CGRect(x: 0, y: 0, width: W, height: H)
  let cg = img.cgImage(forProposedRect: &rect, context: nil, hints: nil)!
  var pb: CVPixelBuffer?
  CVPixelBufferPoolCreatePixelBuffer(nil, adaptor.pixelBufferPool!, &pb)
  CVPixelBufferLockBaseAddress(pb!, [])
  let ctx = CGContext(data: CVPixelBufferGetBaseAddress(pb!), width: W, height: H, bitsPerComponent: 8, bytesPerRow: CVPixelBufferGetBytesPerRow(pb!), space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue)!
  ctx.draw(cg, in: CGRect(x: 0, y: 0, width: W, height: H))
  CVPixelBufferUnlockBaseAddress(pb!, [])
  while !input.isReadyForMoreMediaData { usleep(2000) }
  adaptor.append(pb!, withPresentationTime: CMTime(value: CMTimeValue(i), timescale: fps))
}
input.markAsFinished()
let sem = DispatchSemaphore(value: 0)
writer.finishWriting { sem.signal() }; sem.wait()

// 2) Bild + Ton zusammenführen
let comp = AVMutableComposition()
let vAsset = AVURLAsset(url: stumm)
let vTrack = comp.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid)!
let dauer = vAsset.duration
try! vTrack.insertTimeRange(CMTimeRange(start: .zero, duration: dauer), of: vAsset.tracks(withMediaType: .video)[0], at: .zero)
let tAsset = AVURLAsset(url: URL(fileURLWithPath: tonDatei))
let tSrc = tAsset.tracks(withMediaType: .audio)[0]
let aTrack = comp.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid)!
for (s, l) in starts {
  try! aTrack.insertTimeRange(CMTimeRange(start: .zero, duration: CMTime(seconds: min(l, CMTimeGetSeconds(dauer) - s), preferredTimescale: 600)), of: tSrc, at: CMTime(seconds: s, preferredTimescale: 600))
}
let zielURL = URL(fileURLWithPath: ziel)
try? fm.removeItem(at: zielURL)
let exp = AVAssetExportSession(asset: comp, presetName: AVAssetExportPresetHighestQuality)!
exp.outputURL = zielURL; exp.outputFileType = .mp4; exp.shouldOptimizeForNetworkUse = true
// Ton in den letzten 0,5 s sanft ausblenden
let mixParam = AVMutableAudioMixInputParameters(track: aTrack)
let fadeStart = CMTimeSubtract(dauer, CMTime(seconds: 0.5, preferredTimescale: 600))
mixParam.setVolume(1.0, at: .zero)
mixParam.setVolumeRamp(fromStartVolume: 1.0, toEndVolume: 0.0, timeRange: CMTimeRange(start: fadeStart, end: dauer))
let mix = AVMutableAudioMix(); mix.inputParameters = [mixParam]
exp.audioMix = mix
exp.exportAsynchronously { sem.signal() }; sem.wait()
print("Status", exp.status.rawValue, exp.error?.localizedDescription ?? "ok", "Dauer", CMTimeGetSeconds(dauer))
try? fm.removeItem(at: stumm)
