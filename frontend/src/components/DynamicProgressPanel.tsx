import React, { useState, useEffect } from 'react';
import { Smartphone, Activity, CheckCircle2, Clock, Loader2, Sparkles, Cpu, Layers } from 'lucide-react';
import type { DynamicJobInfo } from '../types';

interface DynamicProgressPanelProps {
  job: DynamicJobInfo | null;
}

const STAGES = [
  { id: 1, title: 'Sandbox Boot', desc: 'Initialize AVD & ADB bridge', icon: Smartphone },
  { id: 2, title: 'Deploy & Launch', desc: 'Install APK & trigger main activity', icon: Layers },
  { id: 3, title: 'Behavioral Profiling', desc: 'Frida API hooks & runtime monitoring (30s)', icon: Activity },
  { id: 4, title: 'ML Classification', desc: 'Dumpsys memory & 13-class inference', icon: Cpu },
];

export const DynamicProgressPanel: React.FC<DynamicProgressPanelProps> = ({ job }) => {
  // Local high-resolution second timer so it ticks every second between 2s polls
  const [localElapsed, setLocalElapsed] = useState<number>(job?.elapsed_seconds || 0);

  useEffect(() => {
    if (job?.elapsed_seconds !== undefined) {
      setLocalElapsed(job.elapsed_seconds);
    }
  }, [job?.elapsed_seconds]);

  useEffect(() => {
    const timer = setInterval(() => {
      setLocalElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalEstimated = job?.estimated_seconds || 25;
  const remainingSec = Math.max(0, totalEstimated - localElapsed);

  // Smooth progress calculation
  const rawProgress = job?.progress !== undefined 
    ? job.progress 
    : Math.min(95, Math.round((localElapsed / totalEstimated) * 100));
  
  // Combine stage index and time interpolation
  const activeStageIndex = job?.stage_index || (localElapsed < 4 ? 1 : localElapsed < 8 ? 2 : localElapsed < 20 ? 3 : 4);
  const currentStageText = job?.stage || (
    activeStageIndex === 1 ? 'Booting Android sandbox emulator...' :
    activeStageIndex === 2 ? 'Installing application & starting activity...' :
    activeStageIndex === 3 ? 'Monitoring system calls & Frida hooks (12s)...' :
    'Extracting telemetry and predicting malware family...'
  );

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-950/40 via-slate-900/60 to-indigo-950/40 p-5 shadow-xl backdrop-blur-md relative overflow-hidden transition-all duration-300">
      {/* Background ambient glow */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Title and Live Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-blue-500/20">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.3)]">
            <Activity className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-slate-100 text-base">Dynamic Sandbox In Progress</h4>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono border border-blue-500/40 font-medium">
                Live Instrumentation
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Executing binary in isolated Android AVD to observe runtime zero-day activity
            </p>
          </div>
        </div>

        {/* Timers & Countdown */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-900/80 px-3.5 py-1.5 rounded-lg border border-slate-700/60 font-mono text-xs">
          <div className="flex items-center gap-1.5 text-blue-300">
            <Clock className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Elapsed: <strong>{formatTime(localElapsed)}</strong></span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-slate-400">
            {remainingSec > 0 ? (
              <span>~{formatTime(remainingSec)} left</span>
            ) : (
              <span className="text-amber-400">Finalizing...</span>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar & Percentage */}
      <div className="mt-4 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-300 font-medium flex items-center gap-1.5 truncate max-w-[80%]">
            <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin shrink-0" />
            <span className="truncate">{currentStageText}</span>
          </span>
          <span className="font-mono font-bold text-blue-400">{rawProgress}%</span>
        </div>

        <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden border border-slate-700/60 p-[1px]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            style={{ width: `${Math.max(8, rawProgress)}%` }}
          />
        </div>
      </div>

      {/* 4-Stage Step Visualizer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-5">
        {STAGES.map((s) => {
          const isDone = activeStageIndex > s.id;
          const isCurrent = activeStageIndex === s.id;
          const Icon = s.icon;

          return (
            <div
              key={s.id}
              className={`p-2.5 rounded-lg border transition-all duration-300 ${
                isDone
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : isCurrent
                  ? 'bg-blue-500/20 border-blue-400/50 text-blue-200 shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                  : 'bg-slate-900/40 border-slate-800/80 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Icon className={`w-4 h-4 ${isDone ? 'text-emerald-400' : isCurrent ? 'text-blue-400 animate-bounce' : 'text-slate-500'}`} />
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin shrink-0" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-700" />
                )}
              </div>
              <p className="text-xs font-semibold leading-tight">{s.title}</p>
              <p className="text-[10px] text-slate-400 leading-tight mt-1 truncate">{s.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Educational Note */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
        <span>
          Dynamic sandbox profiling takes ~60–90s to let the APK execute its entrypoints and hook background daemon behaviors.
        </span>
      </div>
    </div>
  );
};
