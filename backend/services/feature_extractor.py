from pathlib import Path
from backend.utils.exceptions import FeatureExtractionError
from androguard.core.apk import APK
from backend.utils.logger import logger

class FeatureExtractor:
    def extract_static(self, file_path: Path) -> dict:
        try:
            apk_size_bytes = file_path.stat().st_size
            app = APK(str(file_path))
            
            permissions = app.get_permissions()
            n_permissions = len(permissions)
            
            dangerous = ['android.permission.INTERNET', 'android.permission.SEND_SMS', 'android.permission.READ_CONTACTS']
            n_dangerous_perms = sum(1 for p in permissions if p in dangerous)
            
            activities = app.get_activities()
            services = app.get_services()
            receivers = app.get_receivers()
            providers = app.get_providers()
            
            n_suspicious_apis = 0
            
            files = app.get_files()
            has_native_code = 1 if any(f.endswith('.so') for f in files) else 0
            has_dynamic_code = 1 if any(f.endswith('.dex') for f in files) else 0
            
            features = {
                "n_activities": len(activities),
                "n_services": len(services),
                "n_receivers": len(receivers),
                "n_providers": len(providers),
                "n_permissions": n_permissions,
                "n_dangerous_perms": n_dangerous_perms,
                "n_suspicious_apis": n_suspicious_apis,
                "has_native_code": has_native_code,
                "has_dynamic_code": has_dynamic_code,
                "apk_size_bytes": float(apk_size_bytes),
                "apk_size_mb": apk_size_bytes / 1e6,
                "min_sdk": int(app.get_min_sdk_version() or 0),
                "target_sdk": int(app.get_target_sdk_version() or 0),
                "package_name": app.get_package(),
                "permissions_list": list(permissions)
            }
            logger.info("static_extraction_complete", package=features["package_name"])
            return features
            
        except Exception as e:
            logger.error("static_extraction_failed", error=str(e))
            raise FeatureExtractionError(f"Failed to extract features from APK: {str(e)}")
