# 🧭 Semantic Compression Project

An experimental implementation of **semantic communication**,  
where data is transmitted as *meaning* instead of raw binary.  
By letting AI interpret, compress, and regenerate content,  
this project aims to reduce data transfer volume and global energy usage.

This repository serves as a proof-of-concept of **AI-driven meaning-level transmission**,  
demonstrating how images can be shared through captions and regenerated on the receiver side —  
without the original file ever being stored or transmitted.

---

## 🌍 Project Overview

| Goal | Description |
|------|-------------|
| **Reduce communication energy** | By transmitting only *semantic content* (captions, descriptions) instead of raw media |
| **Enable low-bandwidth rich data** | Suitable for satellite and emergency communication environments |
| **Enhance privacy** | Original media is deleted after processing; only regenerated data remains |
| **AI integrity check** | Every piece of content passes through AI filters, enabling automatic verification |
| **Cross-platform vision** | To be integrated in both web-based demos and native iOS apps |

---

## 🧩 Current Version Tree

semantic-compression/
│
├── README.md ← This document (core philosophy)
│
├── web/
│ ├── v1.0/ ← Initial Proof of Concept
│ ├── v1.3/ ← Manual regeneration phase
│ ├── v1.4/ ← Auto regeneration + Cloudflare image deletion ✅
│ └── README_web.md ← Web-side documentation summary
│
├── ios/
│ ├── v1.5/ ← SwiftUI prototype (local AI in development)
│ └── README_ios.md ← iOS-side documentation summary
│
├── docs/
│ ├── architecture_flow_v1.4.png
│ ├── design_concept.md
│ └── paper_outline.md
│
├── LICENSE
└── index.html ← GitHub Pages demo (latest web build)

---

## ⚙️ Tech Stack

| Component | Purpose | Tools |
|------------|----------|--------|
| **Frontend** | Web demo UI | HTML, Vanilla JS |
| **Backend** | AI caption + image regeneration | Cloudflare Workers |
| **Storage** | Temporary image handling | Cloudflare Images |
| **AI Models** | Semantic compression + reconstruction | OpenAI GPT-4o-mini, DALL·E-3 |
| **iOS (planned)** | Local offline mode | SwiftUI + CoreML backend |

---

## 🧠 Communication Flow (v1.4)

User uploads image
↓
Cloudflare Worker → uploads to Cloudflare Images
↓
GPT-4o-mini → generates semantic caption
↓
DALL·E-3 → regenerates image from meaning
↓
Cloudflare → deletes original image
↓
Result: Regenerated image only

✅ Meaning transmitted,  
🗑️ Original data erased,  
🌱 Energy footprint minimized.

---

## 🚀 Next Steps

- **v1.5 (iOS Prototype)**  
  - Local AI compression + regeneration via CoreML  
  - Offline mode: zero server dependency  

- **v2.0 (Cross-device semantic sync)**  
  - Multi-user meaning-based communication  
  - Tokenized semantic data transmission (SNS-scale)

---

## 📜 License

This project is released under the **Apache License 2.0**,  
allowing personal, academic, and commercial use, with attribution required.

---

## 💬 Acknowledgements

Created by **lube8163-lab**, with support from **OpenAI’s GPT-5**  
and Cloudflare’s developer ecosystem.  

> “Transmit *meaning*, not data.”  
> — *Semantic Compression Project*

---
