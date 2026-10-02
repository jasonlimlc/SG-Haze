import React, { useState } from 'react';
import { AlertTriangle, Volume2, VolumeX, Shield, X, BellRing } from 'lucide-react';
import { RegionalReading } from '../types/haze';
import { getPsiBand } from '../services/psiConstants';

interface HazardAlertBannerProps {
  breachingRegions: RegionalReading[];
  psiThreshold: number;
  onOpenAdvisory: () => void;
  onPlayAlarm: () => void;
  isSoundMuted: boolean;
  onToggleSound: () => void;
}

export const HazardAlertBanner: React.FC<HazardAlertBannerProps> = ({
  breachingRegions,
  psiThreshold,
  onOpenAdvisory,
  onPlayAlarm,
  isSoundMuted,
  onToggleSound,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (breachingRegions.length === 0 || isDismissed) {
    return null;
  }

  // Find max PSI among breaching regions
  const maxPsi = Math.max(...breachingRegions.map((r) => r.psi24Hourly));
  const isHazardous = maxPsi > 300;
  const isVeryUnhealthy = maxPsi > 200 && maxPsi <= 300;
  const band = getPsiBand(maxPsi);

  return (
    <div
      role="alert"
      className={`relative border-b ${
        isHazardous
          ? 'bg-red-950/90 border-red-500 text-red-100 shadow-xl shadow-red-950/80 animate-hazard-flash'
          : isVeryUnhealthy
          ? 'bg-orange-950/90 border-orange-500 text-orange-100 shadow-lg shadow-orange-950/60'
          : 'bg-amber-950/80 border-amber-500/80 text-amber-100'
      } py-3.5 px-4 sm:px-6 transition-all`}
    >
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        
        {/* Left: Icon & Warning description */}
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
              isHazardous ? 'bg-red-600 text-white animate-bounce' : 'bg-amber-500 text-slate-950'
            }`}
          >
            {isHazardous ? <BellRing className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider font-mono px-2 py-0.5 rounded bg-black/40 border border-white/20">
                {isHazardous ? 'CRITICAL EMERGENCY' : 'AIR QUALITY ALERT'}
              </span>
              <span className="text-sm font-semibold">
                Threshold exceeded (PSI &gt; {psiThreshold}):{' '}
                <span className="font-bold underline decoration-2">{band.label}</span> Peak PSI{' '}
                <span className="font-mono tabular-nums font-bold text-base">{maxPsi}</span>
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-200 leading-relaxed max-w-3xl">
              <strong className="text-white">Affected Regions:</strong>{' '}
              {breachingRegions.map((r, idx) => (
                <span key={r.region} className="font-mono tabular-nums font-medium">
                  {r.label} ({r.psi24Hourly} PSI / PM2.5: {r.pm25OneHourly} µg/m³)
                  {idx < breachingRegions.length - 1 ? ', ' : ''}
                </span>
              ))}
              . {band.generalAdvisory}
              {band.n95Recommended && (
                <span className="ml-1.5 font-bold text-yellow-300 underline">
                  N95 respirator masks recommended for all outdoor exposure.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          <button
            onClick={onToggleSound}
            className="flex items-center gap-1.5 rounded-md border border-white/20 bg-black/30 px-2.5 py-1 text-xs font-medium hover:bg-black/50 transition-colors"
            title={isSoundMuted ? 'Unmute Audio Alert' : 'Mute Audio Alert'}
          >
            {isSoundMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 text-emerald-400" />}
            <span>{isSoundMuted ? 'Muted' : 'Audio On'}</span>
          </button>

          <button
            onClick={onPlayAlarm}
            className="rounded-md border border-white/20 bg-black/30 px-2.5 py-1 text-xs font-medium hover:bg-black/50 transition-colors"
          >
            Sound Siren
          </button>

          <button
            onClick={onOpenAdvisory}
            className="flex items-center gap-1 rounded-md bg-white text-slate-950 px-3 py-1 text-xs font-bold hover:bg-slate-100 transition-colors"
          >
            <Shield className="h-3.5 w-3.5" />
            <span>MOH Advice</span>
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="rounded-md p-1 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title="Dismiss Alert Banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
