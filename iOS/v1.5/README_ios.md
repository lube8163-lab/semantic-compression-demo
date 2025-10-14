# 📱 Semantic Compression Project — iOS Implementation (v1.5)

## 🧭 Overview | 概要

The **iOS implementation** of the Semantic Compression Project aims to bring  
semantic-level communication to a *standalone, offline environment*.  
By utilizing **CoreML** and on-device AI, this prototype compresses and regenerates media  
without sending any raw data to external servers — enabling **semantic transmission on the edge**.

このiOS実装は、セマンティック通信を**オフラインかつスタンドアロン環境で実現**することを目的としています。  
**CoreML** とローカルAIを活用し、クラウドに依存せずに意味圧縮と再生成を行うことで、  
「デバイス単体で意味を伝える通信」を目指しています。

---

## 🧩 Tech Stack | 技術構成

| Component | Role | Framework / Tools |
|------------|------|-------------------|
| **UI Layer** | User interface & semantic feed | SwiftUI |
| **AI Core** | Meaning extraction & regeneration | CoreML + local inference |
| **Bridge** | AI pipeline management | `SemanticService.swift` |
| **Network (Optional)** | Future cloud sync interface | URLSession / CloudKit |
| **Environment** | iOS 17+ / Xcode 16+ | Swift 5.10 |

---

## ⚙️ Implementation Details | 実装詳細

### 📁 File Structure

ios/v1.5/
├── ContentView.swift # Main UI (Semantic Feed)
├── SemanticService.swift # AI processing layer
└── README_ios.md # This document

---

## 🧠 Processing Flow | 処理の流れ

User selects image (or captures photo)
↓
CoreML model extracts semantic meaning (caption)
↓
AI locally regenerates image from meaning
↓
Original image is discarded
↓
Feed displays regenerated image only

✅ All computation happens **on-device**.  
🧠 The meaning (semantic token) can be optionally shared later via cloud sync.  
🌱 No external API calls = full privacy-preserving semantic transmission.

---

## 🧱 Core Components | 主要コンポーネント

### 🪄 `SemanticService.swift`
Handles AI inference and state management:
- Loads CoreML model  
- Generates caption from input image  
- Regenerates new image using local generative model  
- Deletes original after regeneration  
- Returns structured result to `ContentView`

### 🖼️ `ContentView.swift`
Handles user interaction:
- Image picker or camera input  
- Displays regenerated image  
- Optionally shows semantic token (caption text)  
- Clean SwiftUI layout for smooth UX

---

## 💡 Example Pseudocode (Swift)

```swift
let semanticService = SemanticService()

if let input = UIImage(named: "sample.jpg") {
    let caption = semanticService.generateCaption(from: input)
    let regenerated = semanticService.regenerateImage(from: caption)
    semanticService.deleteOriginal(input)
    display(regenerated)
}
```

---

## 🔐 Privacy & Offline Design | セキュリティ設計

- 💾 No internet required: Entire flow runs on-device
- 🧠 CoreML-driven inference: No external API keys or servers
- 🧹 Original deletion: Source data removed after semantic extraction
- 🔒 Future option: End-to-end encrypted semantic sync for cross-device transmission

---

## 🚀 Future Roadmap | 今後の展開

| Version | Focus | Description |
|----------|--------|-------------|
| **v1.5.1** | Local fine-tuning | Support for custom CoreML models |
| **v1.6** | Cross-device semantic sync | Meaning token sharing between iOS & Web |
| **v2.0** | Full semantic SNS | Multi-user communication through semantic-only payloads |

---

## 📜 License | ライセンス

This project is released under the **Apache License 2.0**,  
allowing personal, academic, and commercial use with attribution required.

本プロジェクトは **Apache License 2.0** のもとで公開されています。  
個人・商用・研究目的を問わず、自由に利用・改変・再配布できます。  
ただし、クレジット表記とライセンス文書の保持をお願いします。

---

## 💬 Acknowledgements | 謝辞

Developed by **lube8163-lab**,  
with inspiration from **OpenAI GPT-5**, **Cloudflare Workers**,  
and the Apple **CoreML / SwiftUI** ecosystem.

> “Transmit meaning, not data.”  
> — *Semantic Compression Project*
