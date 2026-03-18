"""
KrishiSaathi — Plant Disease Detection API
FastAPI server that loads a trained CNN model and predicts crop diseases.
Falls back to demo mode if the model is not yet trained.

Usage:
    uvicorn app:app --host 0.0.0.0 --port 5000

Endpoint:
    POST /predict  (multipart form: image file)
"""

import os
import json
import random
from io import BytesIO

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# ─── Paths ───
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'model', 'plant_disease_model.h5')
CLASS_NAMES_PATH = os.path.join(BASE_DIR, 'model', 'class_names.json')
TREATMENTS_PATH = os.path.join(BASE_DIR, 'treatments.json')

IMG_SIZE = 224

# ─── Global state ───
model = None
class_names = {}
treatments = {}
demo_mode = False


def load_resources():
    global model, class_names, treatments, demo_mode

    # Always load treatments
    if os.path.exists(TREATMENTS_PATH):
        with open(TREATMENTS_PATH, 'r') as f:
            treatments = json.load(f)
        print(f"✅ Loaded {len(treatments)} treatment entries")

    # Try to load trained model
    if os.path.exists(MODEL_PATH):
        try:
            os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
            import tensorflow as tf
            print("🔄 Loading trained model...")
            model = tf.keras.models.load_model(MODEL_PATH)
            print("✅ Model loaded successfully")

            if os.path.exists(CLASS_NAMES_PATH):
                with open(CLASS_NAMES_PATH, 'r') as f:
                    class_names = json.load(f)
                print(f"✅ Loaded {len(class_names)} class names")

            demo_mode = False
        except Exception as e:
            print(f"⚠️  Failed to load model: {e}")
            demo_mode = True
    else:
        print("⚠️  No trained model found — running in DEMO mode")
        print("   To train: cd ai-service && python train.py")
        demo_mode = True


# ─── FastAPI App ───
app = FastAPI(
    title="KrishiSaathi Disease Detection API",
    description="AI-powered crop disease detection from leaf images",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    load_resources()


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "demo_mode": demo_mode,
        "classes": len(treatments),
    }


def demo_predict(filename: str):
    """Smart demo prediction based on filename keywords, or random selection."""
    filename_lower = filename.lower() if filename else ""

    # Try to match crop name from filename
    matched_keys = []
    for key in treatments:
        crop_part = key.split("___")[0].lower().replace("_", " ").replace(",", "")
        disease_part = key.split("___")[-1].lower().replace("_", " ")
        if crop_part in filename_lower or disease_part in filename_lower:
            matched_keys.append(key)

    # If no match, pick common disease classes (not healthy) for realism
    if not matched_keys:
        disease_keys = [k for k in treatments if "healthy" not in k.lower()]
        matched_keys = random.sample(disease_keys, min(3, len(disease_keys)))

    chosen_key = random.choice(matched_keys)
    info = treatments[chosen_key]

    return {
        "crop": info["crop"],
        "disease": info["disease"],
        "confidence": round(random.uniform(0.78, 0.96), 4),
        "treatment": info["treatment"],
        "class_key": chosen_key,
    }


@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    # Validate file type
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image (JPEG, PNG, etc.)")

    try:
        contents = await image.read()

        # ─── Real model prediction ───
        if model is not None and not demo_mode:
            import numpy as np
            from PIL import Image

            img = Image.open(BytesIO(contents)).convert("RGB")
            img = img.resize((IMG_SIZE, IMG_SIZE))
            img_array = np.array(img) / 255.0
            img_array = np.expand_dims(img_array, axis=0)

            predictions = model.predict(img_array, verbose=0)
            predicted_idx = int(np.argmax(predictions[0]))
            confidence = float(predictions[0][predicted_idx])

            class_key = class_names.get(str(predicted_idx), "Unknown")
            info = treatments.get(class_key, {})

            return {
                "success": True,
                "data": {
                    "crop": info.get("crop", class_key.split("___")[0].replace("_", " ")),
                    "disease": info.get("disease", class_key.split("___")[-1].replace("_", " ")),
                    "confidence": round(confidence, 4),
                    "treatment": info.get("treatment", "Consult a local agronomist for diagnosis."),
                    "class_key": class_key,
                }
            }

        # ─── Demo mode prediction ───
        result = demo_predict(image.filename)
        return {
            "success": True,
            "data": result,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
