import React from 'react';
import { HotspotData } from '../types/haze';
import { Flame, Wind, AlertCircle, Eye, ShieldCheck } from 'lucide-react';

interface TransboundaryHotspotsProps {
  hotspot: HotspotData;
}

export const TransboundaryHotspots: React.FC<TransboundaryHotspotsProps> = ({ hotspot }) => {
  const getAlertLevelInfo = (level: 1 | 2 | 3) => {
    switch (level) {
      case 1:
        return {
          title: 'Alert Level 1 (Normal / Dry Season Watch)',
          color: 'text-emerald-400',
          border: 'border-emerald-500/40',
          bg: 'bg-emerald-950/20',
          desc: 'Hotspot activity is contained; scattered localized showers over the ASEAN region.',
        };
      case 2:
        return {
          title: 'Alert Level 2 (Haze Alert / Fire Hotspots Surge)',
          color: 'text-amber-400',
          border: 'border-amber-500/40',
          bg: 'bg-amber-950/20',
          desc: 'Persistent dry weather with high hotspot clusters. Transboundary smoke drift likely.',
        };
      case 3:
        return {
          title: 'Alert Level 3 (Severe Transboundary Warning)',
          color: 'text-red-400',
          border: 'border-red-500/40',
          bg: 'bg-red-950/30',
          desc: 'Severe widespread hotspots with heavy transboundary smoke plumes blanketing Singapore.',
        };
    }
  };

  const alertInfo = getAlertLevelInfo(hotspot.asmcHazeAlertLevel);

  return (
    <div id="hotspot-section" className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-400" />
            <span>Regional Hotspots & Transboundary Smoke Trajectory</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Grounded in ASEAN Specialised Meteorological Centre (ASMC) satellite tracking & monsoon drift patterns.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Source: ASMC / NOAA Satellite Telemetry
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        
        {/* Hotspots Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            Satellite Hotspot Counts
          </span>

          <div className="mt-3 space-y-2.5">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800/80">
              <span className="text-xs text-slate-300">Sumatra, Indonesia</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold font-mono text-orange-400">
                  {hotspot.sumatraHotspots}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">hotspots</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800/80">
              <span className="text-xs text-slate-300">Kalimantan, Borneo</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold font-mono text-amber-400">
                  {hotspot.kalimantanHotspots}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">hotspots</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>Total Regional Fires:</span>
            <span className="font-bold text-white">
              {hotspot.sumatraHotspots + hotspot.kalimantanHotspots}
            </span>
          </div>
        </div>

        {/* Monsoon Wind Vector */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            Monsoon Wind & Dispersion Vector
          </span>

          <div className="mt-3 flex items-center gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800/80">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 shrink-0">
              <Wind className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-mono block">Direction & Velocity</span>
              <span className="text-sm font-bold text-white font-mono">
                {hotspot.prevailingWind}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5 font-mono">
                Speed: {hotspot.windSpeedKmh} km/h
              </span>
            </div>
          </div>

          <p className="mt-2.5 text-[11px] text-slate-400 leading-relaxed">
            Southwest monsoon winds typically convey biomass burning emissions across the Malacca Straits towards Singapore.
          </p>
        </div>

        {/* ASMC Alert Level & Outlook */}
        <div className={`rounded-xl border p-4 ${alertInfo.bg} ${alertInfo.border}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              ASMC Haze Alert
            </span>
            {hotspot.asmcHazeAlertLevel === 1 ? (
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            ) : (
              <AlertCircle className="h-4 w-4 text-amber-400" />
            )}
          </div>

          <h4 className={`text-sm font-bold mt-2 ${alertInfo.color}`}>
            {alertInfo.title}
          </h4>

          <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
            {alertInfo.desc}
          </p>

          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-start gap-1.5 text-[11px] text-slate-300">
            <Eye className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>{hotspot.hazeOutlook}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
