# 🧭 Semantic Compression Project (v1.0)

An experimental implementation of **semantic communication**,  
where data is transmitted as *meaning* instead of raw binary.  
By letting AI interpret, compress, and regenerate content,  
this project aims to reduce data transfer volume and global energy usage.  

This repository provides a proof-of-concept via an **AI-assisted SNS demo**  
where images are “semantically compressed” into AI-generated captions.

---

## 🚀 Current Status

### ✅ Version: v1.0 (as of October 2025)

| Component | Status | Notes |
|------------|---------|-------|
| GitHub Pages | ✅ Working | Image posting & viewing UI |
| Cloudflare Worker | ✅ Working | Acts as API relay to OpenAI |
| OpenAI API | ✅ gpt-4o-mini (vision) | Successfully generates captions |
| Security | ✅ Completed | `.dev.vars` + Cloudflare Secret |
| Billing | ✅ Prepaid ($5 test) | Safe, usage-limited setup |

---

## ⚙️ System Architecture

📦 semantic-compression/
│
├── index.html ← SNS demo (image + caption UI)
│ ├── Form-based upload
│ ├── LocalStorage persistence & cleanup
│ └── Sends data to Worker via fetch()
│
└── semantic-worker/ ← Cloudflare Worker
├── src/index.js ← OpenAI relay (vision-enabled)
├── .dev.vars ← Local API key management
└── wrangler.toml ← Worker configuration

📡 **Flow:**
User post → (fetch) → Cloudflare Worker
→ OpenAI API (gpt-4o-mini)
→ AI caption returned → displayed on SNS

---

## 🧠 Achievements & Findings

### 🎯 Achievements
- Successful integration of **OpenAI vision API** via Cloudflare Workers  
- Full SNS-to-AI pipeline for automatic caption generation  
- Secure handling of API keys using `.dev.vars` + Cloudflare Secret  
- Validation of semantic compression as a method for communication efficiency  

### ⚠️ Known Technical Limitations
- Cloudflare Workers limit JSON body size to **1MB**  
  → Base64-encoded images cannot be transmitted directly  
- Current solution: AI fetches **public image URLs** instead of inline Base64  

---

## 🔜 Next Steps (v1.1 and beyond)

| Phase | Description |
|--------|-------------|
| 🔄 Image URL Automation | Use Cloudflare Images / S3 for temporary image hosting |
| 🧩 SNS Integration | Auto-attach AI captions to posts |
| 🧠 Compression Study | Evaluate data loss vs. semantic accuracy |
| 🌍 Real-world Use | Explore low-bandwidth or disaster communication scenarios |

---

## 🪪 Developer Notes
- Coding assistance: ChatGPT (GPT-5)  
- Model: `gpt-4o-mini` (vision-enabled)  
- API keys managed securely through `.dev.vars` & Cloudflare Secret  
- Billing: Prepaid ($5) with automatic usage cap  

---

## 🧩 Project Significance

Semantic communication proposes a shift from transmitting *data*  
to transmitting the *meaning* behind it.  
This concept, when scaled, could reduce global data transfer energy consumption  
and support efficient communication in low-bandwidth environments  
(such as satellites, IoT, or disaster recovery networks).

---

### 📅 Update History
- **2025-10-07** — v1.0 Completed: successful AI caption generation  
- **2025-10-08 → v1.1** — expanding to URL-based and regeneration workflows  

---

📬 **Notes from the Author**  
This repository is open for experimental and educational purposes.  
Feedback, research collaboration, or related project references are warmly welcomed.
