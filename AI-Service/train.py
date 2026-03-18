"""
KrishiSaathi — Plant Disease CNN Training Script
Uses MobileNetV2 transfer learning on the PlantVillage dataset.

Usage:
    python train.py

Output:
    model/plant_disease_model.h5
    model/class_names.json
"""

import os
import json
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# ─── Config ───
DATASET_DIR = os.path.join(os.path.dirname(__file__), '..', 'AI-Service', 'raw', 'color')
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'model')
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 10  # Increase for better accuracy (15-20 recommended with GPU)

def main():
    os.makedirs(MODEL_DIR, exist_ok=True)

    if not os.path.isdir(DATASET_DIR):
        print(f"❌ Dataset not found at: {DATASET_DIR}")
        print("   Make sure the PlantVillage dataset is at AI-Service/raw/color/")
        return

    print(f"📂 Loading dataset from: {DATASET_DIR}")

    # ─── Data generators with augmentation ───
    train_datagen = ImageDataGenerator(
        rescale=1.0 / 255,
        validation_split=0.2,
        rotation_range=20,
        width_shift_range=0.1,
        height_shift_range=0.1,
        shear_range=0.1,
        zoom_range=0.1,
        horizontal_flip=True,
        fill_mode='nearest',
    )

    val_datagen = ImageDataGenerator(
        rescale=1.0 / 255,
        validation_split=0.2,
    )

    train_gen = train_datagen.flow_from_directory(
        DATASET_DIR,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training',
    )

    val_gen = val_datagen.flow_from_directory(
        DATASET_DIR,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation',
        shuffle=False,
    )

    num_classes = len(train_gen.class_indices)
    class_names = {v: k for k, v in train_gen.class_indices.items()}

    print(f"✅ Found {train_gen.samples} training images")
    print(f"✅ Found {val_gen.samples} validation images")
    print(f"✅ Number of classes: {num_classes}")

    # ─── Save class names ───
    class_names_path = os.path.join(MODEL_DIR, 'class_names.json')
    with open(class_names_path, 'w') as f:
        json.dump(class_names, f, indent=2)
    print(f"💾 Saved class names to: {class_names_path}")

    # ─── Build model (MobileNetV2 transfer learning) ───
    base_model = MobileNetV2(
        weights='imagenet',
        include_top=False,
        input_shape=(IMG_SIZE, IMG_SIZE, 3),
    )
    base_model.trainable = False  # Freeze base layers

    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dropout(0.3),
        layers.Dense(256, activation='relu'),
        layers.Dropout(0.2),
        layers.Dense(num_classes, activation='softmax'),
    ])

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss='categorical_crossentropy',
        metrics=['accuracy'],
    )

    model.summary()

    # ─── Train ───
    print("\n🚀 Starting training...\n")

    callbacks = [
        tf.keras.callbacks.EarlyStopping(
            monitor='val_accuracy',
            patience=3,
            restore_best_weights=True,
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=2,
        ),
    ]

    history = model.fit(
        train_gen,
        epochs=EPOCHS,
        validation_data=val_gen,
        callbacks=callbacks,
    )

    # ─── Save model ───
    model_path = os.path.join(MODEL_DIR, 'plant_disease_model.h5')
    model.save(model_path)
    print(f"\n🎉 Model saved to: {model_path}")

    # ─── Print results ───
    val_loss, val_acc = model.evaluate(val_gen)
    print(f"\n📊 Final validation accuracy: {val_acc:.4f}")
    print(f"📊 Final validation loss: {val_loss:.4f}")

if __name__ == '__main__':
    main()
