export interface ApkAnalysisResult {
    status: string;
    verdict: 'Malware' | 'Benign';
    malware_prob: number;
    benign_prob: number;
    is_malware: boolean;
    family: string | null;
    family_conf: number | null;
    is_novel: boolean;
    dynamic_available: boolean;
    indicators: {
      n_permissions: number;
      n_dangerous_perms: number;
      n_suspicious_apis: number;
      has_native_code: number;
      has_dynamic_code: number;
      has_debug_flag?: number;
      n_activities?: number;
      n_services?: number;
      n_receivers?: number;
    };
    dangerous_permissions: string[];
    apk_info: {
      package_name: string;
      apk_size_mb: number;
      min_sdk: number;
      target_sdk: number;
    };
    analysis_time_ms: number;
  }
