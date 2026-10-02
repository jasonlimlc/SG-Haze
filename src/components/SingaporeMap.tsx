import React, { useState } from 'react';
import { RegionKey, RegionalReading } from '../types/haze';
import { getPsiBand, getPm25Band } from '../services/psiConstants';
import { Compass, Info, Wind } from 'lucide-react';

interface SingaporeMapProps {
  readings: Record<RegionKey, RegionalReading>;
  selectedRegion: RegionKey;
  onSelectRegion: (region: RegionKey) => void;
  psiThreshold: number;
  prevailingWind?: string;
}

export const SingaporeMap: React.FC<SingaporeMapProps> = ({
  readings,
  selectedRegion,
  onSelectRegion,
  psiThreshold,
  prevailingWind = 'South-Southwest (SSW)',
}) => {
  const [metricMode, setMetricMode] = useState<'psi' | 'pm25'>('psi');
  const [hoveredRegion, setHoveredRegion] = useState<RegionKey | null>(null);

  // SVG Paths for Singapore's 5 official NEA monitoring regions
  const regionPaths: Record<Exclude<RegionKey, 'national'>, string> = {
    // West: Tuas, Jurong, Boon Lay, Clementi, Choa Chu Kang, Lim Chu Kang
    west: 'M 45,260 C 40,240 50,210 75,190 C 95,175 110,160 135,135 C 160,110 175,85 195,75 C 215,65 230,85 240,115 C 245,145 250,180 245,210 C 235,235 220,265 195,280 C 165,295 130,285 105,295 C 75,305 50,285 45,260 Z',
    
    // North: Sungei Kadut, Woodlands, Sembawang, Simpang, Mandai
    north: 'M 195,75 C 220,55 260,35 300,35 C 335,35 375,50 415,85 C 395,100 375,120 345,125 C 315,130 280,125 240,115 C 230,85 215,65 195,75 Z',
    
    // Central: Bishan, Ang Mo Kio, Toa Payoh, Novena, Orchard, Bukit Timah
    central: 'M 240,115 C 280,125 315,130 345,125 C 375,120 380,145 375,175 C 370,205 355,225 330,235 C 295,245 270,230 245,210 C 250,180 245,145 240,115 Z',
    
    // East: Tampines, Pasir Ris, Changi, Bedok, Paya Lebar
    east: 'M 415,85 C 445,90 480,105 525,115 C 570,125 595,145 580,175 C 555,205 515,220 465,230 C 420,240 385,235 375,205 C 380,175 375,120 415,85 Z',
    
    // South: Marina Bay, Tanjong Pagar, Telok Blangah, Bukit Merah, Queenstown
    south: 'M 245,210 C 270,230 295,245 330,235 C 355,225 370,205 385,235 C 375,260 345,275 310,275 C 265,275 235,260 195,280 C 220,265 235,235 245,210 Z',
  };

  // Center coordinates for map labels & pin indicators
  const labelCentroids: Record<Exclude<RegionKey, 'national'>, { x: number; y: number; label: string }> = {
    north: { x: 300, y: 75, label: 'North' },
    west: { x: 145, y: 195, label: 'West' },
    central: { x: 305, y: 175, label: 'Central' },
    east: { x: 475, y: 160, label: 'East' },
    south: { x: 300, y: 255, label: 'South' },
  };

  const getRegionFillColor = (regKey: Exclude<RegionKey, 'national'>) => {
    const reading = readings[regKey];
    if (!reading) return '#334155';

    if (metricMode === 'psi') {
      const band = getPsiBand(reading.psi24Hourly);
      return band.colorHex;
    } else {
      const pm25 = reading.pm25OneHourly;
      if (pm25 <= 55) return '#10B981';
      if (pm25 <= 150) return '#0EA5E9';
      if (pm25 <= 250) return '#F59E0B';
      return '#DC2626';
    }
  };

  const activeInspectRegion = hoveredRegion || (selectedRegion !== 'national' ? selectedRegion : 'central');
  const inspectReading = readings[activeInspectRegion as RegionKey] || readings.central;
  const inspectBand = getPsiBand(inspectReading.psi24Hourly);
  const inspectPm25 = getPm25Band(inspectReading.pm25OneHourly);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-sm shadow-xl">
      
      {/* Map Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Singapore Regional Air Quality Map</span>
            <span className="text-xs font-normal text-slate-400 font-mono">NEA 5-Zone Grid</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any region to inspect localized telemetry and air quality hazards.
          </p>
        </div>

        {/* Metric Switcher & Wind Direction */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800 font-mono">
            <Wind className="h-3.5 w-3.5 text-sky-400" />
            <span className="text-slate-300">Wind:</span> {prevailingWind}
          </div>

          <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800">
            <button
              onClick={() => setMetricMode('psi')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                metricMode === 'psi'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              24h PSI
            </button>
            <button
              onClick={() => setMetricMode('pm25')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                metricMode === 'pm25'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1h PM2.5
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative mt-4 flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* SVG Vector Map */}
        <div className="relative w-full max-w-2xl aspect-[650/360] flex items-center justify-center bg-slate-950/40 rounded-xl border border-slate-800/60 p-2 overflow-hidden">
          
          {/* Subtle Background Radar Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* Wind Trajectory Indicator Visual */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 pointer-events-none bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800/80 text-[11px] text-slate-400 font-mono">
            <Compass className="h-3.5 w-3.5 text-sky-400 animate-spin" style={{ animationDuration: '18s' }} />
            <span>Monsoon Drift: SW → NE</span>
          </div>

          <svg
            viewBox="0 0 650 360"
            className="w-full h-full drop-shadow-2xl select-none"
            style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))' }}
          >
            <defs>
              {/* Subtle region glow filter */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Transboundary Smoke Vector Gradient */}
              <linearGradient id="smokeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Prevailing Haze / Wind Plume Arrow simulation */}
            <g opacity="0.4">
              <path
                d="M 50,330 Q 250,220 550,60"
                fill="none"
                stroke="url(#smokeGradient)"
                strokeWidth="40"
                strokeLinecap="round"
                strokeDasharray="8 12"
              />
            </g>

            {/* Singapore Offshore Islands */}
            {/* Jurong Island (West) */}
            <g
              onClick={() => onSelectRegion('west')}
              className="cursor-pointer"
            >
              <title>Jurong Island (West)</title>
              <ellipse
                cx="130"
                cy="325"
                rx="28"
                ry="14"
                fill={getRegionFillColor('west')}
                fillOpacity={selectedRegion === 'west' ? '0.9' : '0.6'}
                stroke="#0f172a"
                strokeWidth="2"
              />
              <text x="130" y="328" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="600" className="pointer-events-none font-mono">
                Jurong Is.
              </text>
            </g>

            {/* Sentosa Island (South) */}
            <g
              onClick={() => onSelectRegion('south')}
              className="cursor-pointer"
            >
              <title>Sentosa (South)</title>
              <ellipse
                cx="295"
                cy="318"
                rx="22"
                ry="8"
                fill={getRegionFillColor('south')}
                fillOpacity={selectedRegion === 'south' ? '0.9' : '0.6'}
                stroke="#0f172a"
                strokeWidth="2"
              />
              <text x="295" y="321" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="600" className="pointer-events-none font-mono">
                Sentosa
              </text>
            </g>

            {/* Pulau Ubin & Tekong (East) */}
            <g
              onClick={() => onSelectRegion('east')}
              className="cursor-pointer"
            >
              <title>Pulau Ubin &amp; Tekong (East)</title>
              <ellipse
                cx="495"
                cy="70"
                rx="24"
                ry="9"
                fill={getRegionFillColor('east')}
                fillOpacity={selectedRegion === 'east' ? '0.9' : '0.6'}
                stroke="#0f172a"
                strokeWidth="2"
              />
              <text x="495" y="73" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="600" className="pointer-events-none font-mono">
                P. Ubin
              </text>

              <ellipse
                cx="565"
                cy="85"
                rx="22"
                ry="14"
                fill={getRegionFillColor('east')}
                fillOpacity={selectedRegion === 'east' ? '0.9' : '0.6'}
                stroke="#0f172a"
                strokeWidth="2"
              />
              <text x="565" y="88" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="600" className="pointer-events-none font-mono">
                P. Tekong
              </text>
            </g>

            {/* 5 Main NEA Landmass Regions */}
            {(['north', 'west', 'central', 'east', 'south'] as Array<Exclude<RegionKey, 'national'>>).map((reg) => {
              const isSelected = selectedRegion === reg;
              const isHovered = hoveredRegion === reg;
              const isBreaching = readings[reg]?.psi24Hourly > psiThreshold;
              const fillColor = getRegionFillColor(reg);

              return (
                <path
                  key={reg}
                  d={regionPaths[reg]}
                  fill={fillColor}
                  fillOpacity={isSelected ? '0.85' : isHovered ? '0.75' : '0.55'}
                  stroke={isSelected ? '#ffffff' : isBreaching ? '#ef4444' : '#0f172a'}
                  strokeWidth={isSelected ? '3' : isBreaching ? '2.5' : '1.5'}
                  strokeLinejoin="round"
                  className="transition-all duration-200 cursor-pointer hover:filter"
                  onMouseEnter={() => setHoveredRegion(reg)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  onClick={() => onSelectRegion(reg)}
                />
              );
            })}

            {/* Centroid Region Badges and Readings */}
            {(['north', 'west', 'central', 'east', 'south'] as Array<Exclude<RegionKey, 'national'>>).map((reg) => {
              const pos = labelCentroids[reg];
              const reading = readings[reg];
              const isSelected = selectedRegion === reg;
              const isBreaching = reading?.psi24Hourly > psiThreshold;
              const displayVal = metricMode === 'psi' ? reading?.psi24Hourly : reading?.pm25OneHourly;
              const unit = metricMode === 'psi' ? 'PSI' : 'µg';

              return (
                <g
                  key={`label-${reg}`}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer pointer-events-auto"
                  onClick={() => onSelectRegion(reg)}
                  onMouseEnter={() => setHoveredRegion(reg)}
                  onMouseLeave={() => setHoveredRegion(null)}
                >
                  {/* Pin Background Capsule */}
                  <rect
                    x="-42"
                    y="-22"
                    width="84"
                    height="44"
                    rx="8"
                    fill="#020617"
                    fillOpacity="0.88"
                    stroke={isSelected ? '#38bdf8' : isBreaching ? '#ef4444' : '#334155'}
                    strokeWidth={isSelected || isBreaching ? '2' : '1'}
                    className="transition-all"
                  />

                  {/* Pulsing indicator if breaching threshold */}
                  {isBreaching && (
                    <circle cx="-32" cy="-12" r="4" fill="#ef4444" className="animate-ping" />
                  )}

                  {/* Region Name */}
                  <text
                    x="0"
                    y="-6"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="10"
                    fontWeight="700"
                    letterSpacing="0.5"
                    className="font-mono uppercase select-none"
                  >
                    {pos.label}
                  </text>

                  {/* Metric Value */}
                  <text
                    x="0"
                    y="13"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="15"
                    fontWeight="800"
                    className="font-mono select-none"
                  >
                    {displayVal}
                    <tspan fontSize="9" fill="#94a3b8" dx="2">
                      {unit}
                    </tspan>
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Map Right-Side Inspector Card */}
        <div className="w-full lg:w-80 shrink-0 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Region Inspector
              </span>
              <h3 className="text-base font-bold text-white">
                {inspectReading.label}
              </h3>
            </div>
            <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono border ${inspectBand.badgeClass}`}>
              {inspectBand.label}
            </span>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 my-3">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 font-mono block">24-hr PSI</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className={`text-2xl font-bold font-mono tabular-nums ${inspectBand.textClass}`}>
                  {inspectReading.psi24Hourly}
                </span>
                <span className="text-xs text-slate-500 font-mono">PSI</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {inspectBand.min} - {inspectBand.max} range
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 font-mono block">1-hr PM2.5</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className={`text-2xl font-bold font-mono tabular-nums ${inspectPm25.color}`}>
                  {inspectReading.pm25OneHourly}
                </span>
                <span className="text-xs text-slate-500 font-mono">µg/m³</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {inspectPm25.label}
              </span>
            </div>
          </div>

          {/* Monitored Towns in this Region */}
          <div className="text-xs text-slate-400 mb-3">
            <span className="text-slate-300 font-medium block mb-1">Key Towns & Neighborhoods:</span>
            <p className="text-[11px] leading-relaxed text-slate-400 font-mono">
              {inspectReading.towns.slice(0, 5).join(' · ')}
              {inspectReading.towns.length > 5 ? ` · +${inspectReading.towns.length - 5} more` : ''}
            </p>
          </div>

          {/* Health Summary */}
          <div className={`p-2.5 rounded-lg border text-xs leading-relaxed ${inspectBand.bgClass} ${inspectBand.borderClass}`}>
            <div className="flex items-center gap-1.5 font-semibold text-slate-200 mb-1">
              <Info className="h-3.5 w-3.5 text-amber-400" />
              <span>NEA Air Quality Advisory</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              {inspectBand.generalAdvisory}
            </p>
          </div>

          {/* Region Select Button */}
          <button
            onClick={() => onSelectRegion(activeInspectRegion as RegionKey)}
            className="w-full mt-3 rounded-lg border border-slate-700 bg-slate-900 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            {selectedRegion === activeInspectRegion ? 'Selected Region' : `Focus on ${inspectReading.label}`}
          </button>
        </div>

      </div>

      {/* Official NEA PSI Scale Legend */}
      <div className="mt-5 pt-4 border-t border-slate-800/80">
        <span className="text-xs font-mono text-slate-400 block mb-2">
          Singapore National Environment Agency (NEA) Air Quality Bands:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 p-1.5 rounded bg-emerald-950/30 border border-emerald-500/30 text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
            <div>
              <span className="font-bold">0 - 50</span> Good
            </div>
          </div>
          <div className="flex items-center gap-2 p-1.5 rounded bg-sky-950/30 border border-sky-500/30 text-sky-300">
            <span className="h-2 w-2 rounded-full bg-sky-400 shrink-0" />
            <div>
              <span className="font-bold">51 - 100</span> Moderate
            </div>
          </div>
          <div className="flex items-center gap-2 p-1.5 rounded bg-amber-950/30 border border-amber-500/30 text-amber-300">
            <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
            <div>
              <span className="font-bold">101 - 200</span> Unhealthy
            </div>
          </div>
          <div className="flex items-center gap-2 p-1.5 rounded bg-orange-950/30 border border-orange-500/30 text-orange-300">
            <span className="h-2 w-2 rounded-full bg-orange-400 shrink-0" />
            <div>
              <span className="font-bold">201 - 300</span> Very Unhealthy
            </div>
          </div>
          <div className="flex items-center gap-2 p-1.5 rounded bg-red-950/40 border border-red-500/40 text-red-300">
            <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
            <div>
              <span className="font-bold">&gt; 300</span> Hazardous
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
