
import type { ApkAnalysisResult } from '../types';
import { ConfidenceBar } from './ConfidenceBar';
import { FamilyBadge } from './FamilyBadge';
import { IndicatorList } from './IndicatorList';
import { ShieldCheck, ShieldAlert, ArrowLeft } from 'lucide-react';

export const ResultCard: React.FC<{ result: ApkAnalysisResult, onReset: () => void }> = ({ result, onReset }) => {
  const isMalware = result.is_malware;

  return (
    <div className="bg-card backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-2xl w-full max-w-3xl mx-auto overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      
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
        {isMalware && <FamilyBadge family={result.family} isNovel={result.is_novel} />}
      </div>

      <div className="p-8 space-y-8">
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
          className="mt-6 flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Analyze Another File
        </button>
      </div>
    </div>
  );
};
