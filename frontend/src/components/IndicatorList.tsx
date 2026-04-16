

interface Indicators {
  n_permissions: number;
  n_dangerous_perms: number;
  n_suspicious_apis: number;
  has_native_code: number;
  has_dynamic_code: number;
  n_activities?: number;
  n_services?: number;
  n_receivers?: number;
}

export const IndicatorList: React.FC<{ indicators: Indicators, dangerousPerms: string[] }> = ({ indicators, dangerousPerms }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatBox label="Permissions" value={indicators.n_permissions} />
        <StatBox label="Dangerous" value={indicators.n_dangerous_perms} alert={indicators.n_dangerous_perms > 5} />
        <StatBox label="Suspicious APIs" value={indicators.n_suspicious_apis} alert={indicators.n_suspicious_apis > 0} />
        <StatBox label="Native Code" value={indicators.has_native_code ? "Yes" : "No"} />
        <StatBox label="Activities" value={indicators.n_activities ?? 0} />
        <StatBox label="Services" value={indicators.n_services ?? 0} />
        <StatBox label="Receivers" value={indicators.n_receivers ?? 0} />
        <StatBox label="Dynamic Code" value={indicators.has_dynamic_code ? "Yes" : "No"} alert={indicators.has_dynamic_code === 1} />
      </div>

      {dangerousPerms.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-300 mb-2">Flagged Permissions</h4>
          <div className="flex flex-wrap gap-2">
            {dangerousPerms.map(p => (
              <span key={p} className="px-2 py-1 bg-red-900/40 text-red-300 text-xs rounded border border-red-800/50 font-mono">
                {p.split('.').pop()}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StatBox = ({ label, value, alert = false }: { label: string, value: string | number, alert?: boolean }) => (
  <div className={`p-3 rounded-xl border ${alert ? 'bg-red-500/5 border-red-500/20' : 'bg-slate-800/40 border-slate-700/50'}`}>
    <div className="text-xs text-slate-400 mb-1">{label}</div>
    <div className={`text-lg font-semibold ${alert ? 'text-red-400' : 'text-slate-200'}`}>{value}</div>
  </div>
);
