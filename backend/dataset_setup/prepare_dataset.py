"""
Dataset Setup Helper
--------------------
Run this script to prepare and organize your dataset for training.

Expected folder structure after running:
dataset/
  train/
    Healthy/
    Citrus_Canker/
    Black_Spot/
    Greening_Disease/
  test/
    Healthy/
    Citrus_Canker/
    Black_Spot/
    Greening_Disease/

Sources (from your project doc):
  https://data.mendeley.com/datasets/6szsnpypdd
  https://data.mendeley.com/datasets/f7cr74mwpj
  https://data.mendeley.com/datasets/3f83gxmv57/2
"""

import os
import shutil
import random
from pathlib import Path

SPLIT_RATIO  = 0.8           # 80% train / 20% test
SEED         = 42
SOURCE_DIR   = "raw_dataset"  # put your downloaded images here
DEST_DIR     = "dataset"
CLASSES      = ["Healthy", "Citrus_Canker", "Black_Spot", "Greening_Disease"]
EXTENSIONS   = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}

random.seed(SEED)


def setup_dirs():
    for split in ["train", "test"]:
        for cls in CLASSES:
            Path(f"{DEST_DIR}/{split}/{cls}").mkdir(parents=True, exist_ok=True)
    print("✅ Directories created.")


def split_and_copy():
    total_copied = 0
    for cls in CLASSES:
        src = Path(SOURCE_DIR) / cls
        if not src.exists():
            print(f"⚠️  Missing source folder: {src}")
            continue

        images = [f for f in src.iterdir() if f.suffix.lower() in EXTENSIONS]
        random.shuffle(images)
        split_idx = int(len(images) * SPLIT_RATIO)
        train_imgs = images[:split_idx]
        test_imgs  = images[split_idx:]

        for img in train_imgs:
            shutil.copy(img, Path(DEST_DIR) / "train" / cls / img.name)
        for img in test_imgs:
            shutil.copy(img, Path(DEST_DIR) / "test"  / cls / img.name)

        print(f"  {cls}: {len(train_imgs)} train / {len(test_imgs)} test")
        total_copied += len(images)

    print(f"\n✅ Total images organized: {total_copied}")


def print_summary():
    print("\n📊 Dataset Summary:")
    print(f"{'Class':<25} {'Train':>8} {'Test':>8}")
    print("-" * 42)
    grand_train = grand_test = 0
    for cls in CLASSES:
        train_count = len(list((Path(DEST_DIR) / "train" / cls).glob("*")))
        test_count  = len(list((Path(DEST_DIR) / "test"  / cls).glob("*")))
        print(f"  {cls:<23} {train_count:>8} {test_count:>8}")
        grand_train += train_count
        grand_test  += test_count
    print("-" * 42)
    print(f"  {'TOTAL':<23} {grand_train:>8} {grand_test:>8}")


if __name__ == "__main__":
    setup_dirs()
    split_and_copy()
    print_summary()
    print("\n🚀 Ready to train! Run: python model_training/train_model.py")
