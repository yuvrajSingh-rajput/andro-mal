
import { ShieldAlert, HelpCircle, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface FamilyBadgeProps {
  family: string | null;
  isNovel: boolean;
  elapsedSeconds?: number;
  estimatedSeconds?: number;
  isDynamicActive?: boolean;
}

const colorMap: Record<string, string> = {
  "Ransomware": "bg-red-500/20 text-red-400 border-red-500/50",
  "Spy": "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/50",
  "Adware": "bg-orange-500/20 text-orange-400 border-orange-500/50",
  "Trojan": "bg-rose-500/20 text-rose-400 border-rose-500/50",
  "Backdoor": "bg-purple-500/20 text-purple-400 border-purple-500/50",
  "Banker": "bg-red-600/20 text-red-500 border-red-600/50",
  "Dropper": "bg-stone-500/20 text-stone-400 border-stone-500/50",
};

export const FamilyBadge: React.FC<FamilyBadgeProps> = ({ family, isNovel, elapsedSeconds, isDynamicActive }) => {
  if (!family) {
    if (isDynamicActive) {
      const formatted = elapsedSeconds !== undefined
        ? `(${Math.floor(elapsedSeconds / 60)}:${(elapsedSeconds % 60).toString().padStart(2, '0')})`
        : '...';

      return (
        <div className="inline-flex items-center px-4 py-1.5 rounded-full border bg-blue-500/15 border-blue-500/40 text-blue-300 text-sm font-semibold shadow-[0_0_15px_rgba(59,130,246,0.2)]">
          <Loader2 className="w-4 h-4 mr-2 animate-spin text-blue-400 shrink-0" />
          <span>Dynamic Sandbox Running <span className="font-mono font-bold text-cyan-300">{formatted}</span></span>
        </div>
      );
    }

    return (
      <div className="inline-flex items-center px-4 py-1.5 rounded-full border bg-red-500/20 border-red-500/40 text-red-400 text-sm font-semibold tracking-wide shadow-[0_0_12px_rgba(239,68,68,0.2)]">
        <ShieldAlert className="w-4 h-4 mr-2 shrink-0" />
        MALICIOUS BINARY
      </div>
    );
  }

  if (isNovel) {
    return (
      <div className="inline-flex items-center px-3 py-1.5 rounded-full border bg-amber-500/20 border-amber-500/50 text-amber-400 text-sm font-semibold shadow-[0_0_15px_rgba(245,158,11,0.2)]">
        <HelpCircle className="w-4 h-4 mr-2" />
        Unknown / Novel Threat
      </div>
    );
  }

  const baseStyle = colorMap[family] || "bg-slate-500/20 text-slate-400 border-slate-500/50";

  return (
    <div className={clsx("inline-flex items-center px-4 py-1.5 rounded-full border text-sm font-bold tracking-wide", baseStyle)}>
      <ShieldAlert className="w-4 h-4 mr-2" />
      {family.toUpperCase()}
    </div>
  );
};
