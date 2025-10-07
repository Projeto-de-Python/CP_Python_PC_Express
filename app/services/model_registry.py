import os
from typing import Dict, List

try:
    import joblib
except Exception:  # pragma: no cover
    joblib = None


MODELS_DIR = "ml_models"


def ensure_models_dir() -> str:
    if not os.path.exists(MODELS_DIR):
        os.makedirs(MODELS_DIR)
    return MODELS_DIR


def model_path(name: str) -> str:
    ensure_models_dir()
    safe = name.lower().replace("..", "_")
    return os.path.join(MODELS_DIR, f"{safe}.joblib")


def list_models() -> List[Dict[str, str]]:
    ensure_models_dir()
    items: List[Dict[str, str]] = []
    for fname in os.listdir(MODELS_DIR):
        if fname.endswith(".joblib"):
            items.append({"name": fname[:-7], "file": os.path.join(MODELS_DIR, fname)})
    return items


def load_model(name: str):
    if joblib is None:
        return None
    path = model_path(name)
    if not os.path.exists(path):
        return None
    try:
        return joblib.load(path)
    except Exception:
        return None


def save_uploaded_model(name: str, data: bytes) -> str:
    path = model_path(name)
    ensure_models_dir()
    with open(path, "wb") as f:
        f.write(data)
    return path


