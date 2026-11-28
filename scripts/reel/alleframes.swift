import AVFoundation
import AppKit
let asset = AVURLAsset(url: URL(fileURLWithPath: CommandLine.arguments[1]))
let out = CommandLine.arguments[2]
let track = asset.tracks(withMediaType: .video)[0]
let reader = try! AVAssetReader(asset: asset)
let o = AVAssetReaderTrackOutput(track: track, outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
reader.add(o); reader.startReading()
var i = 0
let ctx = CIContext()
while let sb = o.copyNextSampleBuffer(), let pb = CMSampleBufferGetImageBuffer(sb) {
  let ci = CIImage(cvPixelBuffer: pb)
  let cg = ctx.createCGImage(ci, from: ci.extent)!
  let data = NSBitmapImageRep(cgImage: cg).representation(using: .png, properties: [:])!
  try! data.write(to: URL(fileURLWithPath: String(format: "%@/v%03d.png", out, i)))
  i += 1
}
print("Bilder:", i)
