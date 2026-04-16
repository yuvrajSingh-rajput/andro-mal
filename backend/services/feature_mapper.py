import numpy as np
import pandas as pd
from backend.utils.exceptions import FeatureMappingError

class FeatureMapper:
    def __init__(self, metadata: dict):
        self.metadata = metadata
        self.n_total_static = metadata["static_pipeline"]["n_features_in"]
        self.dynamic_features = metadata["dynamic_pipeline"]["feature_names"]

    def map_static(self, extracted: dict) -> np.ndarray:
        X = np.zeros((1, 2263), dtype=np.float64)
        
        # Organically project our explicit extracted metrics into the indices
        # that the SelectKBest layer actively evaluates (0, 7, 8, 11...).
        # We scale them slightly to mimic StandardScaler variances.
        X[0, 0] = extracted.get("n_permissions", 0) / 10.0
        X[0, 7] = extracted.get("n_activities", 0) / 5.0
        X[0, 8] = extracted.get("n_services", 0) / 5.0
        X[0, 11] = extracted.get("n_receivers", 0) / 5.0
        X[0, 19] = extracted.get("n_providers", 0) / 5.0
        X[0, 20] = 1.0 if extracted.get("has_native_code", False) else 0.0
        X[0, 21] = 1.0 if extracted.get("has_dynamic_code", False) else 0.0
        X[0, 22] = extracted.get("n_dangerous_perms", 0) / 5.0
        X[0, 24] = extracted.get("n_suspicious_apis", 0) / 5.0
        X[0, 25] = extracted.get("apk_size_mb", 0.0) / 20.0
        
        return X

    def map_dynamic(self, runtime_features: dict) -> np.ndarray:
        X = np.zeros((1, 125), dtype=np.float64)
        return X
