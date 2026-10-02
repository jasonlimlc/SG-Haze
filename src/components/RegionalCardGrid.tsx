import React from 'react';
import { RegionalReading, RegionKey } from '../types/haze';
import { getPsiBand, getPm25Band } from '../services/psiConstants';
import { ArrowUpRight, ArrowDownRight, Minus, AlertTriangle, ShieldCheck } from 'lucide-react';

interface RegionalCardGridProps {
  readings: Record<RegionKey, RegionalReading>;
  selectedRegion: RegionKey;
  onSelectRegion: (reg: RegionKey) => void;
  psiThreshold: number;
}

export const RegionalCardGrid: React.FC<RegionalCardGridProps> = ({
  readings,
  selectedRegion,
  onSelectRegion,
  psiThreshold,
}) => {
  const regions: RegionKey[] = ['north', 'south', 'east', 'west', 'central'];

  return (
    <div id="regions-grid" className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-200 tracking-tight">
            Singapore Regional Telemetry Cards
          </h3>
          <p className="text-xs text-slate-400">
            Split across NEA official monitoring quadrants. Click any card to drill down into pollutant sub-indices.
          </p>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Threshold alert set at &gt; <span className="font-bold text-white">{psiThreshold} PSI</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {regions.map((reg) => {
          const item = readings[reg];
          const isSelected = selectedRegion === reg;
          const band = getPsiBand(item.psi24Hourly);
          const pm25Info = getPm25Band(item.pm25OneHourly);
          const isBreaching = item.psi24Hourly > psiThreshold;
          const isHazardous = item.psi24Hourly > 300;

          return (
            <div
              key={reg}
              onClick={() => onSelectRegion(reg)}
              className={`relative rounded-xl p-4 cursor-pointer transition-all duration-200 border ${
                isSelected
                  ? 'border-white/80 bg-slate-900 shadow-lg shadow-black/40 ring-1 ring-white/50'
                  : isBreaching
                  ? 'border-red-500/60 bg-red-950/20 hover:border-red-400'
                  : 'border-slate-800/90 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              {/* Top Row: Region Label + Trend */}
              <div className="flex items-start justify-between gap-1 mb-2">
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                    {reg.toUpperCase()}
                  </span>
                  <h4 className="text-base font-bold text-white leading-tight">
                    {item.label}
                  </h4>
                </div>

                {/* Trend Delta indicator */}
                <div
                  className={`flex items-center gap-0.5 text-xs font-mono font-medium ${
                    item.delta > 0
                      ? 'text-red-400'
                      : item.delta < 0
                      ? 'text-emerald-400'
                      : 'text-slate-400'
                  }`}
                  title={`Change compared to previous hour`}
                >
                  {item.delta > 0 ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : item.delta < 0 ? (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                  ) : (
                    <Minus className="h-3.5 w-3.5" />
                  )}
                  <span>{item.delta > 0 ? `+${item.delta}` : item.delta}</span>
                </div>
              </div>

              {/* Towns preview */}
              <p className="text-[11px] text-slate-400 truncate mb-3 font-mono">
                {item.towns.slice(0, 3).join(', ')}
              </p>

              {/* Central Value Metric: 24-hr PSI */}
              <div className="flex items-baseline justify-between border-t border-slate-800/80 pt-2.5">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase block">
                    24-hr PSI
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span
                      className={`text-3xl font-extrabold font-mono tabular-nums tracking-tight ${band.textClass}`}
                    >
                      {item.psi24Hourly}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">PSI</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-mono uppercase block">
                    1-hr PM2.5
                  </span>
                  <div className="flex items-baseline justify-end gap-1 mt-0.5">
                    <span
                      className={`text-lg font-bold font-mono tabular-nums ${pm25Info.color}`}
                    >
                      {item.pm25OneHourly}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">µg/m³</span>
                  </div>
                </div>
              </div>

              {/* Unboxed Status & Alert info */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className={`font-semibold ${band.textClass}`}>
                  {band.label}
                </span>

                {isHazardous ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-red-400 font-mono">
                    <AlertTriangle className="h-3 w-3 animate-ping" />
                    HAZARDOUS
                  </span>
                ) : isBreaching ? (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 font-mono">
                    <AlertTriangle className="h-3 w-3" />
                    Alert Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                    <ShieldCheck className="h-3 w-3" />
                    Nominal
                  </span>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
