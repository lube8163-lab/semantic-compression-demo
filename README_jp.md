👉 For English version, see [README.md](./README.md)
# 🧭 Semantic Compression Project (v1.0)

AIを用いた**セマンティック通信**の実証開発。  
「データの内容をAIが理解・圧縮 → 意味単位のプロンプトとして転送 → 再生成」で通信量削減を目指す。  
本リポジトリでは、その初期段階として **画像投稿SNSデモ＋AIキャプション生成** を構築。

---

## 🚀 現在の進行状況

### ✅ バージョン：v1.0（2025-10時点）

| 項目 | 状況 | 備考 |
|------|------|------|
| GitHub Pages | ✅ 稼働中 | 投稿・閲覧UI実装済み |
| Cloudflare Worker | ✅ 稼働中 | OpenAI API中継機能 |
| OpenAI API | ✅ gpt-4o-mini (vision対応) | 画像キャプション生成成功 |
| セキュリティ | ✅ 完備 | `.dev.vars` ＋ Cloudflare Secret |
| API課金 | ✅ プリペイド方式 ($5テスト運用) | 自動制御で安全 |

---

## ⚙️ システム構成

📦 semantic-compression/
│
├── index.html ← SNSデモ（投稿・閲覧UI）
│ ├── 投稿フォーム（画像＋テキスト入力）
│ ├── localStorage保存・上限管理
│ └── fetch()でWorkerへ送信
│
└── semantic-worker/ ← Cloudflare Worker
├── src/index.js ← OpenAI中継（vision対応）
├── .dev.vars ← ローカルAPIキー管理
└── wrangler.toml ← Worker設定

📡 **通信フロー：**
ユーザー投稿 → (fetch) → Cloudflare Worker
→ OpenAI API (gpt-4o-mini)
→ キャプション返却 → SNSに表示

---

## 🧠 成果と検証結果

### 🎯 成功した点
- Cloudflare Worker 経由で OpenAI vision 機能が動作  
- SNSデモで自動キャプション生成まで一連のフロー完成  
- APIキー管理を安全に実装  
- 通信量・エネルギー削減への技術的足がかりを確認  

### ⚠️ 技術的制約
- Workerのリクエスト上限（1MB）により Base64画像は不可  
- 現行では画像URL方式を採用（AIが直接URLを参照）  

---

## 🔜 今後の計画（v1.1以降）

| フェーズ | 内容 |
|----------|------|
| 🔄 画像URL自動生成 | Cloudflare Images / S3経由URL化 |
| 🧩 SNS連携強化 | 投稿時にAIキャプション自動挿入 |
| 🧠 圧縮精度の検証 | AI再生成による情報ロス評価 |
| 🌍 社会応用 | 災害通信・衛星通信など低帯域応用 |

---

## 🪪 開発メモ
- コーディング支援：ChatGPT（GPT-5）  
- モデル利用：`gpt-4o-mini` (vision対応)  
- APIキーは `.dev.vars` および Cloudflare Secret で管理  
- 課金設定：プリペイド方式（安全リミット運用）

---

## 🧩 プロジェクトの意義

セマンティック通信は「**データを意味で転送する**」という新しい通信概念。  
将来的には、SNSのみならず衛星通信・IoT・災害時ネットワークなどに応用できる可能性がある。

---

### 📅 更新履歴
- **2025-10-07**：v1.0 完成（AIキャプション生成成功）
- **2025-10-08以降**：v1.1 開発フェーズ（URL化・再生成対応）

---

📬 **作者メモ**  
このリポジトリは、実験的かつオープンな検証を目的として公開されています。  
もし類似の開発・既存技術があればフィードバックを歓迎します。
