# 🌐 Semantic Compression Project — Web Implementation (v1.4)

## 🧭 Overview | 概要

The web implementation of the **Semantic Compression Project** demonstrates the concept of  
transmitting **meaning instead of data** using AI interpretation and regeneration.  
It enables users to upload an image, have AI describe it semantically, regenerate a new image from that description,  
and delete the original — creating a complete “semantic-only communication” flow.

このWeb実装は、「データではなく意味を送る」というセマンティック通信の概念を実証するものです。  
画像をアップロードするとAIが内容を意味的に要約（キャプション生成）し、  
そのキャプションをもとに再生成された画像だけが残る仕組みを構築しています。

---

## 🧩 Tech Stack | 技術構成

| Component | Role | Tools / Services |
|------------|------|------------------|
| **Frontend** | UI, localStorage, upload handler | HTML, Vanilla JS |
| **Backend** | API relay & AI pipeline | Cloudflare Workers |
| **Temporary Storage** | Image upload & deletion | Cloudflare Images |
| **AI Models** | Meaning compression / regeneration | OpenAI GPT-4o-mini, DALL·E-3 |
| **Hosting** | Demo site | GitHub Pages |

---

## ⚙️ Implementation Details | 実装詳細

### 📁 File Structure

web/v1.4/
├── index.html # SNS-style demo page
├── src/
│ └── index.js # Cloudflare Worker logic
└── README_web.md # This document

### 🧠 Core Logic (Flow Summary)

User uploads image
↓
Cloudflare Worker → upload to Cloudflare Images
↓
OpenAI GPT-4o-mini → generate semantic caption
↓
DALL·E-3 → regenerate new image from meaning
↓
Cloudflare → delete original image automatically
↓
Frontend → display regenerated image only

✅ The original image never remains on the server.  
🗑️ Cloudflare Images confirms deletion.  
🌱 The system transmits only “semantic meaning.”

---

## 🧠 Processing Flow | 処理の流れ（日本語）

1. ユーザーが画像を投稿  
2. Cloudflare Workerが画像を一時的にCloudflare Imagesへ転送  
3. OpenAIの **GPT-4o-mini** が内容を意味的にキャプション化  
4. **DALL·E-3** がそのキャプションから新しい画像を生成  
5. Cloudflareが元画像を削除（Worker側で自動処理）  
6. ブラウザ上には再生成画像のみが表示される  

---

## 🧠 Example Log Output | 実行ログ例

✅ Uploaded: https://imagedelivery.net/.../public
🧠 Caption: 画像は青空の下に滝が流れ落ちる様子を示しています。
🎨 Regenerated image: https://oaidalleapiprodscus.blob.core.windows.net/...
🗑️ Deleted source image: 200c5925-95b7-4b33-4cda-b27174ecfb00

---

## 🧱 Frontend Features | フロントエンド機能

- 📸 Image upload (via `<input type="file">`)
- 🤖 Auto-caption generation (via Worker → OpenAI)
- 🪄 Regeneration button (`再生成`)
- 💾 Local post history (via `localStorage`)
- 🧹 Old posts auto-trimmed (max 10 entries)

---

## 🔐 Security & Privacy | セキュリティとプライバシー

- No OpenAI API keys are stored client-side  
- `.dev.vars` and `wrangler secret` manage credentials securely  
- Cloudflare Secret encryption enabled  
- Original image deleted immediately after regeneration  
- Public-facing demo transmits no personally identifiable data

---

## 🚀 Future Roadmap | 今後の展開

| Version | Direction | Description |
|----------|------------|-------------|
| **v1.5** | Offline Prototype (iOS) | Integrate same semantic logic locally via CoreML |
| **v2.0** | Cross-user meaning exchange | Multi-user “semantic SNS” — sharing meaning tokens |
| **v2.x** | Semantic bandwidth simulation | Quantify bandwidth savings vs traditional transfer |

---

## 📜 License | ライセンス

This project is released under the **Apache License 2.0**,  
allowing personal, academic, and commercial use with attribution required.

本プロジェクトは **Apache License 2.0** のもとで公開されています。  
個人・商用・研究目的を問わず、自由に利用・改変・再配布できます。  
ただし、クレジット表記とライセンス文書の保持をお願いします。

---

## 💬 Acknowledgements | 謝辞

Developed by **lube8163-lab**, powered by **OpenAI GPT-5**  
and **Cloudflare Developer Platform**.

> “Transmit meaning, not data.”  
> — *Semantic Compression Project*
