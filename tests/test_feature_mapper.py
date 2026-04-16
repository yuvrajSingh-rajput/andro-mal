import pytest
import numpy as np
import pandas as pd
from backend.services.feature_mapper import FeatureMapper
from backend.utils.exceptions import FeatureMappingError

@pytest.fixture
def dummy_col_info():
    all_feat_names = [f"feat_{i:04d}" for i in range(1, 9504)]
    return {
        "all_feat_names": all_feat_names,
        "nonzero_var_cols": all_feat_names[:2263],
        "n_features_total": 9503,
        "n_features_nonzero": 2263
    }

@pytest.fixture
def dummy_var_mask(dummy_col_info):
    return pd.Series([True]*2263 + [False]*(9503-2263), index=dummy_col_info["all_feat_names"])

def test_map_static_shape_correct(dummy_col_info, dummy_var_mask):
    mapper = FeatureMapper(dummy_col_info, dummy_var_mask)
    dummy_dict = {"n_permissions": 5, "apk_size_mb": 2.5}
    X = mapper.map_static(dummy_dict)
    assert X.shape == (1, 2263)

def test_map_static_no_nan(dummy_col_info, dummy_var_mask):
    mapper = FeatureMapper(dummy_col_info, dummy_var_mask)
    X = mapper.map_static({})
    assert not np.isnan(X).any()
    assert not np.isinf(X).any()

def test_map_static_empty_dict(dummy_col_info, dummy_var_mask):
    mapper = FeatureMapper(dummy_col_info, dummy_var_mask)
    X = mapper.map_static({})
    assert X.shape == (1, 2263)
    assert np.all(X == 0)

def test_map_static_shape_mismatch_raises(dummy_col_info, dummy_var_mask):
    dummy_col_info["n_features_nonzero"] = 1000
    mapper = FeatureMapper(dummy_col_info, dummy_var_mask)
    with pytest.raises(FeatureMappingError):
        mapper.map_static({})
