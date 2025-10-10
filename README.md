# 🧭 Semantic Compression Project (v1.2)

An experimental implementation of **semantic communication**,  
where data is transmitted as *meaning* instead of raw binary.  
By letting AI interpret, compress, and regenerate content,  
this project aims to reduce data-transfer volume and global energy usage.  

This repository demonstrates a working prototype through an  
**AI-assisted SNS demo**, where images are semantically “compressed”  
into AI-generated captions and safely uploaded via Cloudflare Images.

---

## 🚀 What's New (v1.2)

| Feature | Description |
|----------|-------------|
| **Cloudflare Images integration** | Enables secure, CDN-backed image upload from the SNS frontend. |
| **Worker-based AI bridge** | Cloudflare Worker acts as a middle layer between the frontend and the OpenAI API. |
| **Vision AI Captioning** | Uses `gpt-4o-mini` to generate semantic captions directly from uploaded images. |
| **Secure API-key handling** | All secrets managed via `wrangler secret`; none stored in the repo. |
| **Full E2E flow complete** | SNS → Worker → Cloudflare Images → OpenAI → SNS (display). |

---

## 🧩 Architecture Overview

📦 semantic-compression/
│
├── index.html ← Frontend SNS Demo (GitHub Pages)
│ ├── Image upload form
│ ├── AI caption generation
│ └── Timeline feed (localStorage)
│
└── semantic-worker/ ← Cloudflare Worker (v1.2)
├── src/index.js ← Handles image upload + AI captioning
├── wrangler.jsonc ← Environment variables + secrets
└── Cloudflare Secrets:
• OPENAI_API_KEY
• CF_IMAGES_TOKEN
• CF_ACCOUNT_ID

---

## ⚙️ Data Flow

User Image
↓
Cloudflare Worker (/upload)
↓
Cloudflare Images (upload + CDN)
↓
OpenAI gpt-4o-mini (Vision caption generation)
↓
SNS feed display with AI caption

---

## 🧠 Tech Highlights

- **Vision + Text AI fusion:** OpenAI `gpt-4o-mini` used for visual semantic extraction.  
- **Edge-native architecture:** All requests handled through Cloudflare’s global edge network.  
- **End-to-end privacy:** No raw keys or API credentials exposed client-side.  
- **Local persistence:** Posts cached client-side via `localStorage`.

---

## 🔮 Next Steps (v1.3 Planned)

- Implement **reverse semantic generation** → recreate images from captions using OpenAI Image API (`text2im`).  
- Introduce **semantic tokens** for prompt-level compression.  
- Add **real-time streaming UI** for AI responses.  
- Explore **disaster / satellite low-bandwidth** use cases.

---

## 💬 Acknowledgments

Thanks to the OpenAI API, Cloudflare Workers, and Cloudflare Images teams  
for providing the ecosystem that made semantic-level communication possible.

---

## 📜 Changelog

**v1.0**
- Basic SNS demo using local image compression and mock AI captions.  
- Cloudflare Worker established as OpenAI proxy.  

**v1.2**
- Cloudflare Images integration.  
- Full E2E semantic upload flow.  
- Secure secret-based architecture finalized.
