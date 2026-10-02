import React from 'react';
import { AlertCircle, Radio, Sparkles, Zap } from 'lucide-react';

interface HazeSimulatorBarProps {
  currentScenario?: 'normal' | 'moderate' | 'unhealthy' | 'hazardous';
  isLive: boolean;
  onSelectScenario: (scenario: 'normal' | 'moderate' | 'unhealthy' | 'hazardous') => void;
  onResetToLive: () => void;
}

export const HazeSimulatorBar: React.FC<HazeSimulatorBarProps> = ({
  currentScenario,
  isLive,
  onSelectScenario,
  onResetToLive,
}) => {
  return (
    <div className="bg-slate-900/90 border-y border-slate-800/80 px-4 py-2.5 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5">
        
        {/* Left: Simulation Label */}
        <div className="flex items-center gap-2 text-xs">
          <Zap className="h-3.5 w-3.5 text-amber-400" />
          <span className="font-semibold text-slate-200">Haze Alert Test Simulator:</span>
          <span className="text-slate-400 hidden sm:inline">
            Test regional alerts & emergency thresholds:
          </span>
        </div>

        {/* Right: Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={onResetToLive}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              isLive
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Radio className="h-3 w-3" />
            <span>Gov.sg Live</span>
          </button>

          <button
            onClick={() => onSelectScenario('normal')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              currentScenario === 'normal'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            Good (PSI 35)
          </button>

          <button
            onClick={() => onSelectScenario('moderate')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              currentScenario === 'moderate'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 font-bold'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            Moderate (PSI 78)
          </button>

          <button
            onClick={() => onSelectScenario('unhealthy')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              currentScenario === 'unhealthy'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            Unhealthy (PSI 145)
          </button>

          <button
            onClick={() => onSelectScenario('hazardous')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold transition-all ${
              currentScenario === 'hazardous'
                ? 'bg-red-600 text-white shadow-lg shadow-red-950/80 animate-pulse'
                : 'bg-red-950/40 text-red-300 border border-red-500/40 hover:bg-red-900/40'
            }`}
          >
            <AlertCircle className="h-3 w-3" />
            <span>Hazardous Crisis (PSI 335)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
