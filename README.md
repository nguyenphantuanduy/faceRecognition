# 👤 faceRecognition – Real-Time Multi-Camera Face Recognition System

faceRecognition is a real-time face recognition system designed to enhance home security by detecting and recognizing authorized users from multiple cameras. The system includes anti-spoofing measures to prevent fake face attacks and features a ReactJS frontend for easy interaction.

The system can process multiple camera streams simultaneously, supporting both RTSP cameras and simulated mobile cameras.

---

# 🚀 Features

- Register new user face
- Recognize known users in real-time
- Anti-spoofing detection (detect fake faces via photos or printed images)
- Multi-face recognition
- Real-time camera recognition
- Multi-camera support
- Unknown person detection
- Logging recognition history

---

# 🧠 AI Models

## 1️⃣ RetinaFace + ArcFace (Buffalo Large)

- Purpose: Face detection and embedding extraction
- Pretrained, not retrained
- Embedding vector: 512 dimensions
- Cosine similarity used for recognition
- Recognition threshold: 0.6

## 2️⃣ Silent Face Anti-Spoofing

- Purpose: Detect whether a face is real or spoofed (photo, print, or screen)
- Stateless model integrated into the pipeline

---

# 🏗️ System Architecture

## Components

1. **Camera**
   - Supports RTSP cameras (simulated with mobile camera HTTP for current setup)
2. **Cam Backend**
   - Edge backend deployed in same LAN as cameras
   - Each camera has its own thread
   - Each thread contains 3 parallel sub-threads communicating via queues:
     - `capture_loop`: continuously pulls frames (every 0.3s) and sends to `detect_queue`
     - `detect_loop`: sends frame to AI Server for detection and recognition, receives response
     - `tracking_loop`: performs tracking using DeepSORT

3. **AI Server**
   - Stateless server
   - Steps per frame:
     1. Detect faces
     2. Crop faces
     3. Anti-spoofing detection (`fake -> skip`, `real -> process`)
     4. Compute embedding and cosine similarity for recognition
     5. Return list of Cam Backend URLs corresponding to the user account

4. **Frontend (ReactJS)**
   - Fetches camera URLs per user from AI Server
   - Displays selected camera stream with detection overlay
   - Registers new user faces:
     - Opens user camera
     - Capture button → send frame to AI Server
     - Frontend prompts for name input or skip

5. **Database**
   - JSON-based storage for registered user faces and recognition logs

---

# ⚙️ Tech Stack

**Python / AI Backend**

- insightface
- onnxruntime
- opencv-python
- numpy
- deep-sort-realtime

**PyTorch (CPU)**

- torch
- torchvision
- torchaudio

**Web / Backend**

- fastapi
- uvicorn
- python-multipart
- pydantic
- python-dotenv

**Frontend**

- ReactJS + Node.js
- Nodemon

---

# ⚙️ Installation & Setup

## 1️⃣ Create Virtual Environment

```bash
python -m venv venv
```

Activate environment:

Linux / Mac:

```bash
source venv/bin/activate
```

Windows:

```bash
venv\Scripts\activate
```

## 2️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

## 3️⃣ Run AI Server

Open a terminal:

```bash
cd ai_server
uvicorn modules.face_recognition.backend.AI_backend:app --host 0.0.0.0 --port 8000
```

AI Server runs at: http://localhost:8000

## 4️⃣ Run Cam Backend

Open a new terminal:

```bash
cd ai_server
uvicorn modules.face_recognition.backend.CAM_backend:app --host 0.0.0.0 --port 9000
```

Cam Backend runs at: http://localhost:9000

## 5️⃣ Run Frontend

Open another terminal:

```bash
cd frontend
npm install
npm install -g nodemon  # if not installed globally
npm run dev
```

Frontend runs at: http://localhost:5173 (default Vite port)
