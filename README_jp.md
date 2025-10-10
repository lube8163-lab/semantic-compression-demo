# 🧭 セマンティック通信プロジェクト (v1.2)

AIを用いてデータを「意味単位（セマンティック）」に圧縮・転送する実験的プロジェクト。  
これにより、通信量削減とエネルギー消費の低減を目指す。  

GitHub Pages 上で動作する **AI圧縮SNSデモ** を通して、  
Cloudflare Images へのアップロード・AIキャプション生成を含む  
エンドツーエンドのセマンティック通信を実現した。

---

## 🚀 v1.2での新要素

| 項目 | 内容 |
|------|------|
| **Cloudflare Images統合** | 画像を安全にアップロードし、CDN経由で配信可能に |
| **Workerによる中継層** | フロントとOpenAI APIをCloudflare Workerで連携 |
| **Vision AIキャプション生成** | `gpt-4o-mini` による画像の意味抽出と要約 |
| **Secret管理強化** | `.wrangler secret` による安全なキー管理 |
| **エンドツーエンド完結** | SNS投稿 → Worker → Cloudflare Images → AI応答 → SNS表示 |

---

## 🧩 構成概要

SNSデモ (GitHub Pages)
↓
Cloudflare Worker (/upload)
↓
Cloudflare Images (アップロード + CDN)
↓
OpenAI gpt-4o-mini (Visionによる要約)
↓
SNSフィードにAI生成キャプション表示

---

## 💡 技術的特徴

- OpenAIのVisionモデルで **画像→意味** 変換  
- Cloudflare Edge上で動作する **分散アーキテクチャ**  
- `.wrangler secret` による **セキュアなAPI管理**  
- localStorage による **クライアント側キャッシュ**  

---

## 🔮 今後の展望 (v1.3以降)

- 「意味 → 画像」再生成（Decompression）の実装  
- セマンティックトークンによる圧縮精度の最適化  
- ストリーミング応答対応  
- 災害通信・衛星通信などの低帯域応用  

---

## 🧑‍💻 開発メモ

- 環境構築：Mac mini M2 / Cloudflare Wrangler 4.x  
- API：OpenAI GPT-4o-mini + Cloudflare Images  
- セキュリティ：APIキーはSecret管理  
- 現行バージョン：**v1.2（Semantic Upload + Caption）**

---

## 📜 変更履歴

**v1.0**
- SNSデモの基礎構築  
- Cloudflare Worker経由でのOpenAI通信テスト  

**v1.2**
- Cloudflare Images対応  
- Visionモデルとの統合  
- フルE2E通信フロー完成  

---
