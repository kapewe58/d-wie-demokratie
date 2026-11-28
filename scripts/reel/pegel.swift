import AVFoundation
let asset = AVURLAsset(url: URL(fileURLWithPath: CommandLine.arguments[1]))
let track = asset.tracks(withMediaType: .audio)[0]
let reader = try! AVAssetReader(asset: asset)
let out = AVAssetReaderTrackOutput(track: track, outputSettings: [AVFormatIDKey: kAudioFormatLinearPCM, AVLinearPCMBitDepthKey: 16, AVLinearPCMIsFloatKey: false, AVLinearPCMIsBigEndianKey: false, AVNumberOfChannelsKey: 1, AVSampleRateKey: 16000])
reader.add(out); reader.startReading()
var samples = [Int16]()
while let sb = out.copyNextSampleBuffer(), let bb = CMSampleBufferGetDataBuffer(sb) {
  var len = 0; var ptr: UnsafeMutablePointer<Int8>?
  CMBlockBufferGetDataPointer(bb, atOffset: 0, lengthAtOffsetOut: nil, totalLengthOut: &len, dataPointerOut: &ptr)
  ptr!.withMemoryRebound(to: Int16.self, capacity: len/2) { p in samples.append(contentsOf: UnsafeBufferPointer(start: p, count: len/2)) }
}
let win = 1600 // 0,1 s
var line = ""
for i in stride(from: 0, to: samples.count, by: win) {
  let s = samples[i..<min(i+win, samples.count)]
  let rms = sqrt(s.reduce(0.0) { $0 + Double($1)*Double($1) } / Double(s.count))
  let bar = String(repeating: "#", count: Int(rms/600))
  line += String(format: "%4.1fs %6.0f %@\n", Double(i)/16000, rms, bar)
}
print(line)
