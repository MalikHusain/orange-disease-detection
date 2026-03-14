# 🍊 OrangeAI — Orange Disease Detection System

> AI-powered orange leaf disease detection using CNN deep learning, Flask backend, and React frontend.

---

## 📋 Project Overview

This system detects 4 classes of orange leaf conditions:
| Class | Severity | Description |
|---|---|---|
| ✅ Healthy | None | No disease detected |
| 🔴 Citrus Canker | High | Bacterial infection (Xanthomonas) |
| 🟡 Black Spot | Medium | Fungal disease (Guignardia citricarpa) |
| 🟣 Greening Disease | Critical | HLB — no known cure |

---

## 🗂️ Project Structure

```
orange-disease-detection/
│
├── backend/                    # Flask API server
│   ├── app.py                  # Main Flask app (predict, chat, history)
│   ├── requirements.txt        # Python dependencies
│   └── model/
│       ├── orange_disease_cnn.h5     # Trained CNN model (after training)
│       └── class_indices.json        # Class label mapping
│
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx             # Root component + routing
│   │   ├── App.css             # Global styles
│   │   ├── main.jsx            # Entry point
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Navigation bar
│   │   │   ├── Navbar.css
│   │   │   ├── ChatBot.jsx     # AI chatbot panel
│   │   │   └── ChatBot.css
│   │   └── pages/
│   │       ├── UploadPage.jsx  # Drag & drop image upload + detection
│   │       ├── UploadPage.css
│   │       ├── ResultPage.jsx  # Detection results with probabilities
│   │       ├── ResultPage.css
│   │       ├── HistoryPage.jsx # Session detection history
│   │       ├── HistoryPage.css
│   │       ├── DiseasesPage.jsx # Disease encyclopedia
│   │       └── DiseasesPage.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── model_training/
│   └── train_model.py          # CNN training script (MobileNetV2 + fine-tuning)
│
└── dataset_setup/
    └── prepare_dataset.py      # Dataset organization utility
```

---

## ⚙️ Setup Instructions

### Step 1 — Clone / Download

```bash
# Navigate to project root
cd orange-disease-detection
```

---

### Step 2 — Backend Setup

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

---

### Step 3 — Dataset Preparation

1. Download datasets from:
   - https://data.mendeley.com/datasets/6szsnpypdd
   - https://data.mendeley.com/datasets/f7cr74mwpj
   - https://data.mendeley.com/datasets/3f83gxmv57/2

2. Organize raw images into:
```
dataset_setup/raw_dataset/
    Healthy/
    Citrus_Canker/
    Black_Spot/
    Greening_Disease/
```

3. Run the dataset preparation script:
```bash
cd dataset_setup
python prepare_dataset.py
```

---

### Step 4 — Train the CNN Model

```bash
cd model_training
python train_model.py
```

This will:
- Load and augment your dataset
- Train a MobileNetV2-based CNN in two phases (feature extraction + fine-tuning)
- Save the best model to `backend/model/orange_disease_cnn.h5`
- Save class label mapping to `backend/model/class_indices.json`
- Generate a training history plot

> **Note:** Training takes 20–60 min depending on hardware. GPU recommended (CUDA/MPS).

---

### Step 5 — Start the Flask Backend

```bash
cd backend
python app.py
```

Backend runs on: **http://localhost:5000**

API Endpoints:
| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Server + model status |
| POST | `/predict` | Upload image → disease prediction |
| POST | `/chat` | Send message → chatbot reply |
| GET | `/history` | Fetch recent predictions |
| GET | `/diseases` | Get all disease information |

---

### Step 6 — Start the React Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs on: **http://localhost:3000**

---

## 🚀 Quick Start (Demo Mode)

You can run the frontend and backend even **without a trained model**. The backend will use random mock predictions so you can test the full UI flow.

```bash
# Terminal 1 — Backend
cd backend && python app.py

# Terminal 2 — Frontend  
cd frontend && npm run dev
```

---

## 🧠 Model Architecture

```
Input (224×224×3)
    ↓
MobileNetV2 (pretrained ImageNet, frozen Phase 1)
    ↓
GlobalAveragePooling2D
    ↓
BatchNormalization
    ↓
Dense(256, ReLU) + Dropout(0.4)
    ↓
Dense(128, ReLU) + Dropout(0.3)
    ↓
Dense(4, Softmax)   ← Healthy / Citrus Canker / Black Spot / Greening
```

**Training Strategy:**
- Phase 1 (15 epochs): Train only top layers, base frozen
- Phase 2 (15 epochs): Fine-tune last 30 layers with low LR (1e-5)
- Callbacks: EarlyStopping, ReduceLROnPlateau, ModelCheckpoint

**Expected Accuracy:** ~90–95% on test set

---

## 🌟 Features

- 🔍 **Image Upload & Detection** — Drag & drop or click-to-upload, instant CNN prediction
- 📊 **Probability Bars** — Visual confidence scores for all 4 classes
- 💬 **AI Chatbot** — Ask about diseases, treatments, and plant care
- 📋 **Detection History** — Session-based history with summary stats
- 🌿 **Disease Encyclopedia** — Detailed info on all 4 diseases
- 📱 **Fully Responsive** — Works on mobile, tablet, and desktop
- 🟢 **Backend Status Indicator** — Shows model ready / demo / offline status

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, CSS (no UI library) |
| Backend | Python, Flask, Flask-CORS |
| AI Model | TensorFlow, Keras, MobileNetV2 CNN |
| Image Processing | Pillow, NumPy |

---

## 📦 API Usage Example

```bash
# Predict disease from leaf image
curl -X POST http://localhost:5000/predict \
  -F "image=@leaf.jpg"

# Chat with the assistant
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is Citrus Canker?"}'
```

---

## 🤝 Credits

- Dataset: Mendeley Data repositories
- Base Model: MobileNetV2 (ImageNet pretrained)
- Project: AI-Based Orange Disease Detection System
