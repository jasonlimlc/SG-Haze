import React from 'react';
import { RegionalReading } from '../types/haze';
import { Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface PollutantBreakdownProps {
  reading: RegionalReading;
}

interface PollutantDef {
  key: string;
  name: string;
  fullName: string;
  value: number;
  unit: string;
  safeLimit: number;
  period: string;
  description: string;
}

export const PollutantBreakdown: React.FC<PollutantBreakdownProps> = ({ reading }) => {
  const pollutants: PollutantDef[] = [
    {
      key: 'pm25_1h',
      name: 'PM2.5 (1-hr)',
      fullName: 'Fine Particulate Matter (1-hr Real-Time)',
      value: reading.pm25OneHourly,
      unit: 'µg/m³',
      safeLimit: 55,
      period: '1-Hour Mean',
      description: 'Microscopic soot & smoke combustion particles. Used by Singaporeans for immediate outdoor activity planning.',
    },
    {
      key: 'pm25_24h',
      name: 'PM2.5 (24-hr)',
      fullName: 'Fine Particulate Matter (24-hr Cumulative)',
      value: reading.pm25TwentyFourHourly,
      unit: 'µg/m³',
      safeLimit: 37.5,
      period: '24-Hour Average',
      description: 'Key driver of Singapore 24-hr PSI sub-index during transboundary smoke haze events.',
    },
    {
      key: 'pm10_24h',
      name: 'PM10 (24-hr)',
      fullName: 'Coarse Particulate Matter',
      value: reading.pm10TwentyFourHourly,
      unit: 'µg/m³',
      safeLimit: 50,
      period: '24-Hour Average',
      description: 'Inhalable coarse particles such as ash, dust, and industrial suspension.',
    },
    {
      key: 'o3_8h',
      name: 'Ozone (O3)',
      fullName: 'Ground-level Ozone (8-hr max)',
      value: reading.o3EightHourMax,
      unit: 'µg/m³',
      safeLimit: 100,
      period: '8-Hour Max',
      description: 'Photochemical secondary pollutant created by sunlight reacting with volatile organic compounds and nitrogen oxides.',
    },
    {
      key: 'no2_1h',
      name: 'Nitrogen Dioxide (NO2)',
      fullName: 'Nitrogen Dioxide (1-hr max)',
      value: reading.no2OneHourMax,
      unit: 'µg/m³',
      safeLimit: 120,
      period: '1-Hour Max',
      description: 'Emitted from motor vehicle exhausts and energy generation facilities across the industrial sectors.',
    },
    {
      key: 'so2_24h',
      name: 'Sulphur Dioxide (SO2)',
      fullName: 'Sulphur Dioxide (24-hr)',
      value: reading.so2TwentyFourHourly,
      unit: 'µg/m³',
      safeLimit: 50,
      period: '24-Hour Average',
      description: 'Formed from combustion of sulphur-bearing fuels and refinery processing in Jurong Island.',
    },
    {
      key: 'co_8h',
      name: 'Carbon Monoxide (CO)',
      fullName: 'Carbon Monoxide (8-hr max)',
      value: reading.coEightHourMax,
      unit: 'mg/m³',
      safeLimit: 9.0,
      period: '8-Hour Max',
      description: 'Colourless gas formed through incomplete combustion of biomass and vehicular engines.',
    },
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            <span>Pollutant Sub-Index Matrix: {reading.label}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Full 6-pollutant breakdown evaluated by the National Environment Agency to compute Singapore’s PSI.
          </p>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Updated: <span className="text-slate-200">{reading.updatedAt} SGT</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">
        {pollutants.map((pol) => {
          const ratio = Math.min(pol.value / pol.safeLimit, 2.5);
          const percent = Math.min(Math.round((pol.value / pol.safeLimit) * 100), 100);
          const isElevated = pol.value > pol.safeLimit;

          return (
            <div
              key={pol.key}
              className={`rounded-xl border p-3.5 transition-all ${
                isElevated
                  ? 'border-amber-500/50 bg-amber-950/20'
                  : 'border-slate-800/80 bg-slate-950/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <span className="text-[11px] font-mono text-slate-400 block uppercase">
                    {pol.period}
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    {pol.name}
                  </h4>
                </div>

                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className={`text-xl font-bold font-mono tabular-nums ${isElevated ? 'text-amber-400' : 'text-slate-200'}`}>
                      {pol.value}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{pol.unit}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    Safe limit: {pol.safeLimit}
                  </span>
                </div>
              </div>

              {/* Progress Meter */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2 mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    ratio > 1.5
                      ? 'bg-red-500'
                      : ratio > 1.0
                      ? 'bg-amber-400'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              {/* Description */}
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {pol.description}
              </p>

              {/* Status Note */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-mono">
                  {percent}% of threshold
                </span>
                {isElevated ? (
                  <span className="flex items-center gap-1 text-amber-400 font-medium">
                    <ShieldAlert className="h-3 w-3" />
                    Elevated
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle2 className="h-3 w-3" />
                    Normal
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
