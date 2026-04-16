import json
import joblib
import numpy as np
from pathlib import Path
from backend.app.config import MALWARE_THRESHOLD, FAMILY_CONF_MIN, ZERO_DAY_LABEL
from backend.utils.exceptions import ModelPredictionError

class ModelService:
    def __init__(self):
        self.pipeline_static = None
        self.pipeline_dynamic = None
        self.le_family = None
        self.metadata = None
        self._loaded = False

    def load(self, model_dir: Path) -> None:
        try:
            self.pipeline_static = joblib.load(model_dir / "pipeline_static_binary.pkl")
            self.pipeline_dynamic = joblib.load(model_dir / "pipeline_dynamic_family.pkl")
            self.le_family = joblib.load(model_dir / "label_encoder_family.pkl")
            
            with open(model_dir / "model_metadata.json", "r") as f:
                self.metadata = json.load(f)
                
            if len(self.le_family.classes_) != 13:
                raise ModelPredictionError("Label encoder does not have 13 classes")
                
            self._loaded = True
        except Exception as e:
            raise ModelPredictionError(f"Failed to load models: {str(e)}")

    def predict_static(self, X: np.ndarray) -> dict:
        if not self._loaded:
            raise ModelPredictionError("Models not loaded")
        
        expected_shape = self.pipeline_static.steps[0][1].n_features_in_
        if X.shape != (1, expected_shape):
            raise ModelPredictionError(f"Wrong input shape for static model: {X.shape}")
            
        try:
            probs = self.pipeline_static.predict_proba(X)[0]
            malware_prob = float(probs[1])
            benign_prob = float(probs[0])
            is_malware = malware_prob >= MALWARE_THRESHOLD
            
            return {
                "verdict": "Malware" if is_malware else "Benign",
                "malware_prob": malware_prob,
                "benign_prob": benign_prob,
                "is_malware": is_malware
            }
        except Exception as e:
            raise ModelPredictionError(f"Static prediction failed: {str(e)}")

    def predict_dynamic(self, X: np.ndarray) -> dict:
        if not self._loaded:
            raise ModelPredictionError("Models not loaded")
            
        expected_shape = self.pipeline_dynamic.steps[0][1].n_features_in_
        if X.shape != (1, expected_shape):
            raise ModelPredictionError(f"Wrong input shape for dynamic model: {X.shape}")
            
        try:
            probs = self.pipeline_dynamic.predict_proba(X)[0]
            max_conf = float(np.max(probs))
            class_idx = np.argmax(probs)
            
            if max_conf < FAMILY_CONF_MIN:
                is_novel = True
                family = ZERO_DAY_LABEL
            else:
                is_novel = False
                family = self.le_family.inverse_transform([class_idx])[0]
                
            all_probs = {self.le_family.classes_[i]: float(probs[i]) for i in range(len(probs))}
            
            return {
                "family": family,
                "confidence": max_conf,
                "is_novel": is_novel,
                "all_probs": all_probs
            }
        except Exception as e:
            raise ModelPredictionError(f"Dynamic prediction failed: {str(e)}")
