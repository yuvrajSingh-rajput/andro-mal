
import type { ApkAnalysisResult, DynamicJobInfo } from '../types';
import { ConfidenceBar } from './ConfidenceBar';
import { FamilyBadge } from './FamilyBadge';
import { IndicatorList } from './IndicatorList';
import { DynamicProgressPanel } from './DynamicProgressPanel';
import { ShieldCheck, ShieldAlert, ArrowLeft, Cpu } from 'lucide-react';

export const ResultCard: React.FC<{ 
  result: ApkAnalysisResult; 
  onReset: () => void;
  dynamicJob?: DynamicJobInfo | null;
}> = ({ result, onReset, dynamicJob }) => {
  const isMalware = result.is_malware;

  // In local development (npm run dev), full dynamic sandbox is enabled.
  // In production builds (Vercel), it defaults to false for seamless UX unless VITE_ENABLE_DYNAMIC_ANALYSIS='true' is provided.
  const isDynamicEnabled = import.meta.env.VITE_ENABLE_DYNAMIC_ANALYSIS !== undefined
    ? import.meta.env.VITE_ENABLE_DYNAMIC_ANALYSIS === 'true'
    : import.meta.env.DEV;

  const isDynamicActive = isDynamicEnabled && !!dynamicJob && dynamicJob.status !== 'complete';

  return (
    <div className="bg-card backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-2xl w-full max-w-3xl mx-auto overflow-hidden animate-in fade-in slide-from-bottom-4 duration-500">
      
      {/* Banner */}
      <div className={`p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${isMalware ? 'bg-red-500/10 border-b border-red-500/20' : 'bg-emerald-500/10 border-b border-emerald-500/20'}`}>
        <div className="flex items-center space-x-4">
          {isMalware ? <ShieldAlert className="w-10 h-10 text-red-500 shrink-0" /> : <ShieldCheck className="w-10 h-10 text-emerald-500 shrink-0" />}
          <div>
            <h2 className={`text-2xl font-bold ${isMalware ? 'text-red-400' : 'text-emerald-400'}`}>
              {isMalware ? 'MALWARE DETECTED' : 'BENIGN APPLICATION'}
            </h2>
            <p className="text-sm text-slate-400">Analysis completed in {result.analysis_time_ms}ms</p>
          </div>
        </div>
        {isMalware && (
          <FamilyBadge 
            family={result.family} 
            isNovel={result.is_novel} 
            elapsedSeconds={dynamicJob?.elapsed_seconds}
            estimatedSeconds={dynamicJob?.estimated_seconds}
            isDynamicActive={isDynamicActive}
          />
        )}
      </div>

      <div className="p-8 space-y-7">
        {/* Dynamic Sandbox Active Live Progress Panel (Shown locally or when enabled) */}
        {isDynamicActive && (
          <DynamicProgressPanel job={dynamicJob} />
        )}

        {/* Dynamic Analysis Completed Telemetry Badge (when dynamic analysis has completed) */}
        {isDynamicEnabled && !isDynamicActive && result.dynamic_available && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 flex items-center justify-between text-xs text-emerald-300">
            <div className="flex items-center space-x-2.5">
              <Cpu className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-semibold text-emerald-200">Dynamic Sandbox Telemetry Completed: </span>
                <span>Hooked behavioral calls verified against 13-class ML model.</span>
              </div>
            </div>
            {result.family_conf !== null && (
              <span className="font-mono bg-emerald-500/20 px-2.5 py-1 rounded-md border border-emerald-500/40 font-bold">
                Conf: {(result.family_conf * 100).toFixed(1)}%
              </span>
            )}
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-slate-200 mb-4">Model Confidence</h3>
          <ConfidenceBar malwareProb={result.malware_prob} benignProb={result.benign_prob} />
        </div>

        <div className="flex flex-wrap gap-6 text-sm py-4 border-y border-slate-700/50">
          <div><span className="text-slate-400">Package:</span> <span className="text-slate-200 font-mono truncate max-w-[200px] inline-block align-bottom">{result.apk_info?.package_name || 'N/A'}</span></div>
          <div><span className="text-slate-400">Size:</span> <span className="text-slate-200">{result.apk_info?.apk_size_mb?.toFixed(2) || '0'} MB</span></div>
          <div><span className="text-slate-400">SDK:</span> <span className="text-slate-200">{result.apk_info?.min_sdk || 0} → {result.apk_info?.target_sdk || 0}</span></div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-200 mb-4">Static Analysis Indicators</h3>
          <IndicatorList indicators={result.indicators} dangerousPerms={result.dangerous_permissions || []} />
        </div>

        <button
          onClick={onReset}
          className="mt-4 flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Analyze Another File
        </button>
      </div>
    </div>
  );
};
