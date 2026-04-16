

interface ConfidenceBarProps {
  malwareProb: number;
  benignProb: number;
}

export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({ malwareProb, benignProb }) => {
  const malPct = Math.round(malwareProb * 100);
  const benPct = Math.round(benignProb * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm font-medium mb-2">
        <span className="text-red-400">Malware: {malPct}%</span>
        <span className="text-emerald-400">Benign: {benPct}%</span>
      </div>
      
      <div className="h-4 w-full bg-slate-700 rounded-full overflow-hidden flex relative">
        <div 
          className="bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-1000 ease-out" 
          style={{ width: `${malPct}%` }} 
        />
        <div 
          className="bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000 ease-out" 
          style={{ width: `${benPct}%` }} 
        />
        
        {/* Threshold marker */}
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/20 z-10" />
      </div>
      <div className="text-center mt-1 text-slate-500 text-xs">Threshold: 50%</div>
    </div>
  );
};
