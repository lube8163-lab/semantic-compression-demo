# 🧭 Semantic Compression Project (v1.3)

An experimental implementation of **semantic communication**,  
where data is transmitted as *meaning* instead of raw binary.  

By letting AI interpret, compress, and regenerate visual content,  
this project demonstrates the concept of *semantic-level data transmission* —  
sending only the "meaning" and reconstructing the original image on the receiver side.

---

## 🌐 Overview

This repository provides a full working proof-of-concept (v1.3)  
where an image is semantically compressed into an AI-generated caption,  
then decompressed back into a regenerated image — all processed via  
Cloudflare Workers and OpenAI APIs.

The ultimate goal is to enable **low-bandwidth, high-meaning communication**,  
where only the semantic representation (text or embedding) is transmitted.

---

## 🧩 Architecture

📷 Image (Sender)
↓ Semantic Compression (AI Caption)
🧾 Caption (Meaning Data)
↓ Semantic Decompression (AI Regeneration)
🖼️ Reconstructed Image (Receiver)

---

## ⚙️ System Components

| Layer | Technology | Purpose |
|-------|-------------|----------|
| Frontend | HTML + JS (GitHub Pages) | Upload, compress, and display posts |
| Middleware | Cloudflare Worker | Secure relay between browser and OpenAI |
| Storage | Cloudflare Images | Temporary hosting for uploaded images |
| AI Models | gpt-4o-mini / dall-e-3 | Caption generation & image regeneration |

---

## 🔁 Processing Flow (v1.3)

1. User uploads an image from browser  
2. Image is resized and uploaded to Cloudflare Images  
3. Cloudflare Worker sends the image URL to OpenAI (`gpt-4o-mini`) for caption generation  
4. Caption text is returned to the browser and displayed as a post  
5. User clicks **🪄 Regenerate**  
6. Worker sends caption → OpenAI (`dall-e-3`) → reconstructed image  
7. Generated image is shown below the post  

---

## ✅ Achievements (v1.3)

| Feature | Status |
|----------|--------|
| Cloudflare Worker (proxy & storage) | ✅ Completed |
| Image upload (Cloudflare Images API) | ✅ Completed |
| Vision-based caption generation (gpt-4o-mini) | ✅ Working |
| Caption → Image regeneration (dall-e-3) | ✅ Working |
| URL-based data exchange (no Base64 limit) | ✅ Stable |
| LocalStorage SNS demo | ✅ Functional prototype |

---

## 🧠 Semantic Insight

This prototype demonstrates that an image can be  
**reconstructed from its semantic representation** —  
effectively transmitting the "meaning" rather than the pixels.  

Even if visual fidelity is imperfect,  
the **semantic continuity** is preserved across compression and decompression.  
This establishes a practical foundation for next-generation  
communication protocols beyond bit-level data.

---

## 🔐 Security & Stability

- **API keys** handled via Cloudflare Secrets  
- **Account ID** stored in Worker vars  
- **No image data** included in public repositories  
- **Upload limit control:** Large base64 payloads avoided through Cloudflare Images URL pipeline

---

## 🚀 Future Work (v1.4 and beyond)

### 🎯 v1.4: Auto Regeneration + Source Erasure

- Automate full cycle:  
  Upload → Caption → Regenerate → Delete source  
- Run captioning and regeneration entirely on the server side  
- Display only the regenerated (semantic) image in timeline  
- Remove original images from Cloudflare after use  

This would realize the **pure semantic communication loop**,  
where only the "meaning" is transmitted between sender and receiver.

---

## 🔬 Research Directions

| Focus | Goal |
|--------|------|
| **Information Efficiency** | Measure bandwidth and energy reduction |
| **Semantic Fidelity** | Quantify meaning retention vs pixel similarity |
| **Recursive Compression** | Test iterative meaning regeneration cycles |
| **Embedding-based Transmission** | Replace captions with compact semantic tokens |
| **Disaster / Satellite Communication** | Apply to extreme low-bandwidth scenarios |

---

## 🧰 Tech Stack Summary

📁 semantic-compression/
│
├── index.html ← Frontend SNS demo (GitHub Pages)
│ └── Image upload / Caption / Regeneration UI
│
└── semantic-worker/
├── src/index.js ← Cloudflare Worker (gpt-4o-mini + dall-e-3)
├── .dev.vars ← Local API keys
├── wrangler.jsonc ← Worker config (CF_ACCOUNT_ID etc.)
└── Cloudflare Secrets managed securely

---

## 📜 License

This project is open and experimental.  
All generated data is non-commercial and for research demonstration only.
