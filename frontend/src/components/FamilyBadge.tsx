
import { ShieldAlert, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface FamilyBadgeProps {
  family: string | null;
  isNovel: boolean;
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

export const FamilyBadge: React.FC<FamilyBadgeProps> = ({ family, isNovel }) => {
  if (!family) return null;

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
