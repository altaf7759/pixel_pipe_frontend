# PixelPipe 🚀  
**High Performance Image Processing Pipeline**

PixelPipe is a backend-focused image processing system that transforms a single uploaded image into multiple optimized variants using parallel background workers and real-time progress updates.

The project is designed to emphasize **performance, concurrency, and system architecture** rather than just UI-level image manipulation.

---

## ✨ Features

- Upload a single image and generate multiple processed variants
- Parallel image processing using **Node.js Worker Threads**
- CPU-core–level load distribution using **Node.js Cluster**
- Real-time job progress updates via **Server-Sent Events (SSE)**
- Platform-specific image outputs (e.g., Instagram, Facebook)
- Additional transformations such as **Blur** and **Black & White**
- Fault-tolerant job execution with safe worker cleanup
- Clean Git commit history with incremental feature development

---

## 🏗 Architecture Overview

PixelPipe follows a **parent–child job pipeline** model:

1. A single image upload creates a **parent job**
2. Multiple **child jobs** are spawned for each transformation type
3. Each child job runs in a separate **worker thread**
4. Results are streamed to the client using **SSE**
5. The UI updates progressively as jobs complete

This approach avoids blocking the main event loop and enables efficient parallel execution.

---

## ⚙️ Tech Stack

### Backend
- Node.js
- Worker Threads
- Cluster
- Sharp (image processing)
- Server-Sent Events (SSE)

### Frontend
- React
- Tailwind CSS

### Tooling
- Git (feature-based commits)
- REST APIs

---

## 📈 Performance Notes

- Achieved approximately **~3× faster image processing throughput** by parallelizing transformations using Worker Threads
- Improved request handling under concurrent load by distributing traffic across CPU cores with Node.js Cluster
- Non-blocking architecture ensures responsiveness even during heavy processing

---

## 🔮 Future Enhancements

- AI-based image transformations (e.g., background removal, upscaling)
- Preset bundles for specific social media platforms
- ZIP download for all generated assets
- Persistent job storage and retry mechanisms
- Cloud storage integration

---

## 📌 Why PixelPipe?

PixelPipe was built to explore **real-world backend challenges** such as:
- Concurrency
- Background job orchestration
- Performance optimization
- Real-time client updates

Rather than being a simple image filter app, PixelPipe focuses on **how systems scale and communicate under load**.
