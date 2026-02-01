# 🧭 Semantic Compression Project

An experimental implementation of **semantic communication**,  
where data is transmitted as *meaning* instead of raw binary.

By letting AI interpret, compress, and regenerate content,  
this project explores how communication systems can reduce data transfer volume,
energy consumption, and privacy risks by operating at the **semantic level** rather than the file level.

This repository serves as the **conceptual and experimental core** of the Semantic Compression project.

---

## 📦 Related Repositories

The Semantic Compression project has evolved into multiple independent implementations.

This repository focuses on **core philosophy, early experiments, and web-based proof-of-concepts**.

Actively developed application-level implementations live in separate repositories:

- **Mim (iOS App)**  
  An experimental, on-device iOS social app based on semantic compression,  
  distributed via TestFlight.  
  👉 https://github.com/lube8163-lab/mim-ios

This separation allows research and theory to remain lightweight,
while user-facing applications evolve independently.

---

## 🌍 Project Overview

| Goal | Description |
|------|-------------|
| **Reduce communication energy** | Transmit *semantic content* instead of raw media |
| **Enable low-bandwidth richness** | Operable in satellite or emergency environments |
| **Enhance privacy** | Original media is deleted after semantic extraction |
| **AI-mediated integrity** | All content passes through AI interpretation layers |
| **Cross-platform vision** | Concepts applicable to web, mobile, and offline systems |

---

## 🧩 Repository Structure

```text
semantic-compression/
│
├── README.md              ← Core philosophy and project overview
│
├── web/
│   ├── v1.0/              ← Initial proof of concept
│   ├── v1.3/              ← Manual regeneration phase
│   ├── v1.4/              ← Auto regeneration + Cloudflare image deletion ✅
│   └── README_web.md      ← Web-side documentation summary
│
├── ios/
│   ├── v1.5/              ← Early SwiftUI prototype (research / local AI exploration)
│   └── README_ios.md      ← Notes on early iOS experiments
│
├── docs/
│   ├── architecture_flow_v1.4.png
│   ├── design_concept.md
│   └── paper_outline.md
│
├── LICENSE
└── index.html             ← GitHub Pages demo (latest web build)
```


> Note:  
> The actively distributed iOS application has been separated into its own repository  
> to focus on user-facing design, privacy guarantees, and TestFlight distribution.

---

## ⚙️ Tech Stack

| Component | Purpose | Tools |
|----------|---------|-------|
| **Frontend** | Web demo UI | HTML, Vanilla JS |
| **Backend** | Semantic extraction & regeneration | Cloudflare Workers |
| **Storage** | Temporary image handling | Cloudflare Images |
| **AI Models** | Semantic compression & reconstruction | GPT-4o-mini, DALL·E 3 |
| **iOS (research)** | Early local AI exploration | SwiftUI, CoreML |

For the production-oriented iOS application, see the **Mim** repository.

---

## 🧠 Communication Flow (Web v1.4)
```text
User uploads image
↓
Cloudflare Worker → uploads to Cloudflare Images
↓
AI model → generates semantic caption
↓
Image generation model → reconstructs image from meaning
↓
Cloudflare → deletes original image
↓
Result: regenerated image only
```

✅ Meaning transmitted  
🗑️ Original data erased  
🌱 Energy footprint minimized  

---

## 🚀 Next Steps (This Repository)

- Further refinement of semantic communication theory
- Documentation of architecture and design philosophy
- Exploration of non-visual semantic modalities (text, audio, symbolic data)
- Preparation of academic or long-form explanatory materials

> Application-level development continues independently in related repositories.


---

## 🔐 Security & Public Demo Considerations

The web-based implementation (v1.4) included in this repository is intentionally
configured in a **safe, public-demo mode**.

To prevent abuse of AI generation resources and unintended cost or privacy risks,
the following restrictions are applied:

- Public request authentication (non-secret application key)
- File type and size validation
- Rate and endpoint surface minimization
- Immediate deletion of original uploaded media

These safeguards do **not** alter the core semantic communication concept.
Rather, they reflect an important insight of this project:

> In semantic communication systems,  
> **who is allowed to perform semantic transformation is part of the protocol itself.**

Full, unrestricted semantic pipelines remain a **theoretical reference model**
and are explored in documentation and research materials rather than open demos.


---

## 📜 License

This project is released under the **Apache License 2.0**,  
allowing personal, academic, and commercial use with attribution.

---

## 💬 Acknowledgements

Created by **lube8163-lab**, with support from OpenAI’s language models  
and Cloudflare’s developer ecosystem.

> “Transmit *meaning*, not data.”  
> — *Semantic Compression Project*


