import StableDiffusion
import CoreML
import SwiftUI

struct ContentView: View {
    @State private var genLog = "Ready"
    @State private var generatedImage: UIImage?
    @State private var isGenerating = false
    
    var body: some View {
        VStack(spacing: 16) {
            Text(genLog).font(.caption).multilineTextAlignment(.center)
            
            if let img = generatedImage {
                Image(uiImage: img)
                    .resizable()
                    .scaledToFit()
                    .frame(height: 260)
            }
            
            Button(isGenerating ? "Generating..." : "Run txt2img") {
                Task { await runTxt2Img() }
            }
            .buttonStyle(.borderedProminent)
            .disabled(isGenerating)
        }
        .padding()
    }
    
    @MainActor
    func runTxt2Img() async {
        isGenerating = true
        genLog = "🚀 Loading pipeline..."
        do {
            guard let compiledURL = Bundle.main.resourceURL?.appendingPathComponent("compiled") else {
                genLog = "compiled フォルダが見つかりません"
                isGenerating = false
                return
            }

            // ML設定
            let mlConfig = MLModelConfiguration()
            mlConfig.computeUnits = .cpuAndGPU   // .allより軽量で安定
            
            // パイプライン初期化
            let pipeline = try StableDiffusionPipeline(
                resourcesAt: compiledURL,
                controlNet: []     // controlNetは空配列でOK
            )
            try pipeline.loadResources()

            genLog = "🖋️ Generating..."

            let images = try pipeline.generateImages(
                prompt: "A group walking near snow and car over a forest near a mountain",
                imageCount: 1,
                stepCount: 15,
                seed: 42,
                guidanceScale: 7.5,
                disableSafety: true,
                scheduler: .dpmSolverMultistepScheduler
            )
            
            if let cg = images.first ?? nil {
                generatedImage = UIImage(cgImage: cg!)
                genLog = "✅ Generation complete."
            } else {
                genLog = "⚠️ No image generated"
            }

        } catch {
            genLog = "❌ Error: \(error.localizedDescription)"
        }
        isGenerating = false
    }
}
