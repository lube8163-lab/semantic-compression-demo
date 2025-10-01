# Semantic Compression Demo

This repository is a **demo project of semantic compression using AI**.  
The goal is to experiment with an alternative communication method where data is **compressed into semantic prompts** and **regenerated on the receiver’s side**, aiming to reduce global data transmission and energy consumption.

---

## 🎯 Background & Goal
In recent years, data traffic in SNS and online services has been rapidly increasing.  
At the same time, issues related to energy consumption and infrastructure load are becoming more serious.  

This project explores an idea where instead of sending raw data,  
- the data is **compressed into a semantic form (prompt)** by AI,  
- transmitted as lightweight text,  
- and **regenerated on the receiver’s side**.  

---

## 🛠️ Current Features
- Image posting with automatic resizing & JPEG compression  
- LocalStorage saving (remains after reload)  
- Max 10 posts are kept (older ones are automatically deleted)  
- SNS-like UI timeline  

---

## 🔮 Roadmap
- AI-based automatic caption generation  
- Semantic prompt generation & reconstruction demo  
- Sharing posts among users (towards a real SNS)  

---

## 👩‍💻 Development Notes
- This is a **beginner-level learning & trial project**  
- Most of the coding is supported by **AI (ChatGPT, etc.)**  
- If you know any similar research or projects, please let me know 🙏  

---

## 🌐 Demo URL
[Demo page here](https://lube8163-lab.github.io/semantic-compression-demo/)

---

## 📜 License
MIT License (planned)

---

# セマンティック圧縮デモ

このリポジトリは **AIを利用したセマンティック圧縮のデモプロジェクト**です。  
「データそのもの」ではなく **意味ベースのプロンプト**を送信し、受信側で再生成することで、  
**世界的な通信量・エネルギー消費を減らす**ことを目的としています。

---

## 🎯 背景・目的
近年、SNSやオンラインサービスのデータ通信量は増加し続けています。  
その一方で、通信インフラやエネルギー消費の課題も深刻化しています。  

このプロジェクトでは、  
- 通常の「データそのもの」を送る代わりに  
- **AIが理解できる形に圧縮（セマンティック圧縮）して送信**  
- 受信側で再生成する  

というアイデアを試験的に実装していきます。  

---

## 🛠️ 現状の機能
- 画像投稿（リサイズ＆JPEG圧縮あり）  
- LocalStorageに保存（リロードしても消えない）  
- 最大10件まで保存（古い投稿は自動削除）  
- SNS風タイムライン表示  

---

## 🔮 今後の予定
- AIによる自動キャプション生成  
- 圧縮プロンプト生成と再構築デモ  
- 投稿の共有機能（SNS化）  

---

## 👩‍💻 開発メモ
- **初心者による学習・試行プロジェクト**です  
- コーディングは **AI支援（ChatGPT等）** を活用しています  
- 類似研究や既存サービスをご存知の方はぜひ教えてください 🙏  

---

## 🌐 公開URL
[デモページはこちら](https://lube8163-lab.github.io/semantic-compression-demo/)

---

## 📝 Personal Notes (自分用メモ)
- 現状はデモ版として動作確認中  
- 保存はLocalStorageベース、サーバーは未導入  
- 将来的にはプロンプトのみを保存・共有 → 再生成で通信負荷を削減する流れを目指す  
- 参考にした記事や気になるニュース:  
  - OpenAI “Sora by OpenAI” (SNS × AI生成動画)  
- 次の実装ステップ: AIキャプション生成（まずはダミーで）
