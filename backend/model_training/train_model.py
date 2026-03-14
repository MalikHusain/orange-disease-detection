"""
Orange Disease Detection - CNN Model Training Script
Dataset classes: Healthy, Citrus Canker, Black Spot, Greening Disease
"""

import os
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
import matplotlib.pyplot as plt
import json

# ─────────────────────────────────────────
# Configuration
# ─────────────────────────────────────────
IMG_SIZE     = (224, 224)
BATCH_SIZE   = 32
EPOCHS       = 30
NUM_CLASSES  = 4
DATASET_DIR  = "../dataset"          # adjust to your dataset path
MODEL_SAVE_PATH = "../backend/model/orange_disease_cnn.h5"
CLASS_NAMES  = ["Healthy", "Citrus_Canker", "Black_Spot", "Greening_Disease"]

os.makedirs(os.path.dirname(MODEL_SAVE_PATH), exist_ok=True)

# ─────────────────────────────────────────
# Data Generators
# ─────────────────────────────────────────
train_datagen = ImageDataGenerator(
    rescale=1.0 / 255,
    rotation_range=30,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    vertical_flip=True,
    brightness_range=[0.8, 1.2],
    fill_mode="nearest",
    validation_split=0.2
)

test_datagen = ImageDataGenerator(rescale=1.0 / 255)

train_generator = train_datagen.flow_from_directory(
    os.path.join(DATASET_DIR, "train"),
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    subset="training",
    shuffle=True
)

val_generator = train_datagen.flow_from_directory(
    os.path.join(DATASET_DIR, "train"),
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    subset="validation",
    shuffle=False
)

test_generator = test_datagen.flow_from_directory(
    os.path.join(DATASET_DIR, "test"),
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    shuffle=False
)

# Save class indices
class_indices = train_generator.class_indices
with open("../backend/model/class_indices.json", "w") as f:
    json.dump(class_indices, f, indent=2)
print("Class indices:", class_indices)

# ─────────────────────────────────────────
# Model: Transfer Learning with MobileNetV2
# ─────────────────────────────────────────
base_model = keras.applications.MobileNetV2(
    input_shape=(*IMG_SIZE, 3),
    include_top=False,
    weights="imagenet"
)
base_model.trainable = False  # Freeze base initially

model = keras.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.BatchNormalization(),
    layers.Dense(256, activation="relu"),
    layers.Dropout(0.4),
    layers.Dense(128, activation="relu"),
    layers.Dropout(0.3),
    layers.Dense(NUM_CLASSES, activation="softmax")
], name="OrangeDiseaseDetector")

model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=1e-3),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)
model.summary()

# ─────────────────────────────────────────
# Callbacks
# ─────────────────────────────────────────
callbacks = [
    ModelCheckpoint(
        MODEL_SAVE_PATH,
        monitor="val_accuracy",
        save_best_only=True,
        verbose=1
    ),
    EarlyStopping(
        monitor="val_accuracy",
        patience=7,
        restore_best_weights=True,
        verbose=1
    ),
    ReduceLROnPlateau(
        monitor="val_loss",
        factor=0.3,
        patience=3,
        min_lr=1e-6,
        verbose=1
    )
]

# ─────────────────────────────────────────
# Phase 1 – Train top layers
# ─────────────────────────────────────────
print("\n=== Phase 1: Training top layers ===")
history1 = model.fit(
    train_generator,
    validation_data=val_generator,
    epochs=15,
    callbacks=callbacks,
    verbose=1
)

# ─────────────────────────────────────────
# Phase 2 – Fine-tune last 30 base layers
# ─────────────────────────────────────────
print("\n=== Phase 2: Fine-tuning ===")
base_model.trainable = True
for layer in base_model.layers[:-30]:
    layer.trainable = False

model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=1e-5),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

history2 = model.fit(
    train_generator,
    validation_data=val_generator,
    epochs=EPOCHS,
    initial_epoch=15,
    callbacks=callbacks,
    verbose=1
)

# ─────────────────────────────────────────
# Evaluate
# ─────────────────────────────────────────
print("\n=== Test Evaluation ===")
test_loss, test_acc = model.evaluate(test_generator)
print(f"Test Accuracy: {test_acc * 100:.2f}%")
print(f"Test Loss:     {test_loss:.4f}")

# ─────────────────────────────────────────
# Plot Training History
# ─────────────────────────────────────────
acc  = history1.history["accuracy"]  + history2.history["accuracy"]
val  = history1.history["val_accuracy"] + history2.history["val_accuracy"]
loss = history1.history["loss"] + history2.history["loss"]
vloss= history1.history["val_loss"] + history2.history["val_loss"]

fig, axes = plt.subplots(1, 2, figsize=(14, 5))
axes[0].plot(acc,  label="Train Acc")
axes[0].plot(val,  label="Val Acc")
axes[0].set_title("Model Accuracy"); axes[0].legend()
axes[1].plot(loss, label="Train Loss")
axes[1].plot(vloss,label="Val Loss")
axes[1].set_title("Model Loss"); axes[1].legend()
plt.tight_layout()
plt.savefig("../backend/model/training_history.png")
plt.show()
print(f"\nModel saved → {MODEL_SAVE_PATH}")
