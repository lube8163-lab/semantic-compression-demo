//
//  CaptionGenerator_BLIP1.swift
//  SemanticCompressionApp
//
//  Created by Tasuku on 2025/11/07.
//

import CoreML
import UIKit

@MainActor
final class CaptionGenerator_BLIP1 {
    private let visionModel: MLModel
    private let decoderModel: MLModel
    private let vocab: [String: Int]
    private let invVocab: [Int: String]

    struct BlipRawCaption {
        let tokens: [Int]
        let tokenStrings: [String]
        let cleaned: String
    }

    init() throws {
        // 🔹 モデルのロード
        guard
            let visionURL = Bundle.main.url(forResource: "BLIP1_vision_encoder", withExtension: "mlmodelc"),
            let decoderURL = Bundle.main.url(forResource: "BLIP1_decoder_step_fixed", withExtension: "mlmodelc")
        else {
            throw NSError(domain: "BLIP1", code: -1,
                          userInfo: [NSLocalizedDescriptionKey: "BLIP1 models not found in bundle"])
        }

        visionModel = try MLModel(contentsOf: visionURL)
        decoderModel = try MLModel(contentsOf: decoderURL)

        // 🧩 ここに追加：デコーダ入出力の詳細をダンプ
        let decDesc = decoderModel.modelDescription
        print("🔎 Decoder input keys:", Array(decDesc.inputDescriptionsByName.keys))
        for (name, fd) in decDesc.inputDescriptionsByName {
            if let c = fd.multiArrayConstraint {
                print("  • \(name): MultiArray shape=\(c.shape), dtype=\(c.dataType.rawValue)")
            } else if let ic = fd.imageConstraint {
                print("  • \(name): Image \(ic.pixelsWide)x\(ic.pixelsHigh)")
            } else {
                print("  • \(name): type=\(fd.type)")
            }
        }
        print("🔎 Decoder output keys:", Array(decDesc.outputDescriptionsByName.keys))
        for (name, fd) in decDesc.outputDescriptionsByName {
            if let c = fd.multiArrayConstraint {
                print("  • \(name): MultiArray shape=\(c.shape), dtype=\(c.dataType.rawValue)")
            } else {
                print("  • \(name): type=\(fd.type)")
            }
        }

        // 🔹 vocab.json のロード
        guard let vocabURL = Bundle.main.url(forResource: "vocab", withExtension: "json") else {
            throw NSError(domain: "BLIP1", code: -2,
                          userInfo: [NSLocalizedDescriptionKey: "vocab.json not found"])
        }
        let data = try Data(contentsOf: vocabURL)
        let vocabDict = try JSONDecoder().decode([String: Int].self, from: data)
        vocab = vocabDict
        invVocab = Dictionary(uniqueKeysWithValues: vocabDict.map { ($1, $0) })

        print("✅ Loaded vocab with \(vocab.count) tokens")
    }

    // MARK: - Caption Generation
    func caption(for image: UIImage, maxTokens: Int = 20) throws -> BlipRawCaption {
        // 🧠 1️⃣ Visionエンコード
        guard let buffer = image.pixelBuffer(width: 384, height: 384) else {
            throw NSError(domain: "BLIP1", code: -3, userInfo: nil)
        }

        let encoderInput = try MLDictionaryFeatureProvider(
            dictionary: ["pixel_values": MLFeatureValue(pixelBuffer: buffer)]
        )
        let encoderOut = try visionModel.prediction(from: encoderInput)

        print("📤 Encoder outputs: \(encoderOut.featureNames)")

        // last_hidden_state を取得
        guard let hidden = encoderOut.featureValue(for: "last_hidden_state") ??
                            encoderOut.featureValue(for: "var_2600") else {
            throw NSError(domain: "BLIP1", code: -4,
                          userInfo: [NSLocalizedDescriptionKey: "No encoder output"])
        }

        print("✅ Vision encoding complete")

        // 🧩 2️⃣ Token初期化
        var pickedTokenIDs: [Int] = []
        var pickedTokenStrings: [String] = []

        let seqLen = 5
        let tokenArray = try MLMultiArray(shape: [1, NSNumber(value: seqLen)], dataType: .float32)
        for i in 0..<seqLen { tokenArray[i] = 0 }

        // 🧠 3️⃣ Decoderループ
        for step in 0..<maxTokens {
            let decoderInput = try MLDictionaryFeatureProvider(dictionary: [
                "input_ids": MLFeatureValue(multiArray: tokenArray),
                "encoder_hidden_states": hidden
            ])
            let result = try decoderModel.prediction(from: decoderInput)
            print("Decoder output keys:", result.featureNames)
 
            guard let logits = result.featureValue(for: "var_1854")?.multiArrayValue else {
                print("⚠️ No logits at step \(step)")
                break
            }

            let shape = logits.shape.map { Int(truncating: $0) }
            print("Logits shape:", logits.shape)

            let vocabSize = shape.last ?? 0
            let lastPos = shape.count >= 2 ? (shape[1] - 1) : 0

            // --- ⬇️ Top-k サンプリング処理 ⬇️ ---
            let k = 5
            var scored: [(idx: Int, logit: Float)] = []

            for v in 0..<vocabSize {
                let val = logits[[0, NSNumber(value: lastPos), NSNumber(value: v)]].floatValue
                scored.append((idx: v, logit: val))
            }

            scored.sort { $0.logit > $1.logit }
            let topK = Array(scored.prefix(min(k, scored.count)))

            guard let choice = topK.randomElement() else { break }
            let bestIdx = choice.idx
            let bestVal = choice.logit
            let tokenStr = invVocab[bestIdx] ?? "?"

            print("🧠 Step \(step): token=\(bestIdx) (\(tokenStr)) val=\(bestVal) [top-k]")

            pickedTokenIDs.append(bestIdx)
            pickedTokenStrings.append(tokenStr)

            // トークン列を更新
            for i in 0..<(seqLen - 1) {
                tokenArray[i] = tokenArray[i + 1]
            }
            tokenArray[seqLen - 1] = NSNumber(value: Float32(bestIdx))
        }

        // 🧹 BPE後処理 + ゆる整形
        let cleaned = pickedTokenStrings
            .map { $0
                .replacingOccurrences(of: "</w>", with: "")
                .replacingOccurrences(of: "Ġ", with: " ")
                .replacingOccurrences(of: "▁", with: " ")
            }
            .joined(separator: " ")
            .replacingOccurrences(of: "  ", with: " ")
            .trimmingCharacters(in: .whitespacesAndNewlines)

        let promptLike: String
        if cleaned.isEmpty {
            promptLike = "(no caption)"
        } else {
            let cap = cleaned.prefix(1).uppercased() + cleaned.dropFirst()
            promptLike = "A photo of \(cap)"
        }

        print("📝 Final Caption: \(promptLike)")
        return BlipRawCaption(
            tokens: pickedTokenIDs,
            tokenStrings: pickedTokenStrings,
            cleaned: promptLike
        )
    }
}

// MARK: - UIImage → CVPixelBuffer
extension UIImage {
    func pixelBuffer(width: Int, height: Int) -> CVPixelBuffer? {
        let attrs = [
            kCVPixelBufferCGImageCompatibilityKey: kCFBooleanTrue!,
            kCVPixelBufferCGBitmapContextCompatibilityKey: kCFBooleanTrue!
        ] as CFDictionary
        var buffer: CVPixelBuffer?
        guard CVPixelBufferCreate(kCFAllocatorDefault,
                                  width,
                                  height,
                                  kCVPixelFormatType_32ARGB,
                                  attrs,
                                  &buffer) == kCVReturnSuccess,
              let pb = buffer else { return nil }

        CVPixelBufferLockBaseAddress(pb, [])
        let ctx = CGContext(data: CVPixelBufferGetBaseAddress(pb),
                            width: width,
                            height: height,
                            bitsPerComponent: 8,
                            bytesPerRow: CVPixelBufferGetBytesPerRow(pb),
                            space: CGColorSpaceCreateDeviceRGB(),
                            bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue)
        if let cg = self.cgImage {
            ctx?.draw(cg, in: CGRect(x: 0, y: 0, width: width, height: height))
        }
        CVPixelBufferUnlockBaseAddress(pb, [])
        return pb
    }
}
