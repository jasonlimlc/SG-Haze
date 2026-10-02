import React, { useState } from 'react';
import { RegionKey, RegionalReading } from '../types/haze';
import { getPsiBand, REGION_DETAILS } from '../services/psiConstants';
import { Search, MapPin, X } from 'lucide-react';

interface RegionSelectorProps {
  selectedRegion: RegionKey;
  onSelectRegion: (region: RegionKey) => void;
  readings: Record<RegionKey, RegionalReading>;
  psiThreshold: number;
}

export const RegionSelector: React.FC<RegionSelectorProps> = ({
  selectedRegion,
  onSelectRegion,
  readings,
  psiThreshold,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const regionKeys: RegionKey[] = ['national', 'north', 'south', 'east', 'west', 'central'];

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) return;

    const lower = q.toLowerCase().trim();
    // Check if town matches any region
    for (const [key, details] of Object.entries(REGION_DETAILS)) {
      if (
        details.label.toLowerCase().includes(lower) ||
        details.short.toLowerCase().includes(lower) ||
        details.towns.some((t) => t.toLowerCase().includes(lower))
      ) {
        onSelectRegion(key as RegionKey);
        break;
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
      
      {/* Search Input for Towns */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search town (e.g. Woodlands, Jurong, Bedok, Orchard)..."
          className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-8 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Segmented Region Switcher */}
      <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-950 rounded-lg border border-slate-800/80 scrollbar-none">
        {regionKeys.map((key) => {
          const reading = readings[key];
          const isSelected = selectedRegion === key;
          const band = getPsiBand(reading?.psi24Hourly || 0);
          const isBreaching = (reading?.psi24Hourly || 0) > psiThreshold;
          const label = REGION_DETAILS[key].short;

          return (
            <button
              key={key}
              onClick={() => onSelectRegion(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              {key !== 'national' && (
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: band.colorHex }}
                />
              )}
              {key === 'national' && <MapPin className="h-3 w-3 text-emerald-400" />}
              <span>{label}</span>
              <span
                className={`font-mono tabular-nums text-[11px] px-1.5 py-0.2 rounded ${
                  isBreaching
                    ? 'bg-red-500/20 text-red-400 font-bold border border-red-500/30'
                    : 'bg-slate-900 text-slate-300'
                }`}
              >
                {reading?.psi24Hourly ?? '--'}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
};
