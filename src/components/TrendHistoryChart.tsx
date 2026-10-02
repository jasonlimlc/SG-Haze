import React, { useState } from 'react';
import { HistoricalDataPoint, RegionKey } from '../types/haze';
import { TrendingUp } from 'lucide-react';

interface TrendHistoryChartProps {
  history: HistoricalDataPoint[];
  selectedRegion: RegionKey;
  onSelectRegion: (reg: RegionKey) => void;
  psiThreshold: number;
}

export const TrendHistoryChart: React.FC<TrendHistoryChartProps> = ({
  history,
  selectedRegion,
  onSelectRegion,
  psiThreshold,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const regionKeys: RegionKey[] = ['national', 'north', 'south', 'east', 'west', 'central'];

  const activeKey = selectedRegion === 'national' ? 'national' : selectedRegion;

  // Chart dimensions
  const width = 800;
  const height = 240;
  const padding = { top: 25, right: 30, bottom: 35, left: 45 };

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Max scale calculation
  const maxDataVal = Math.max(
    ...history.map((d) => Math.max(d.north, d.south, d.east, d.west, d.central, d.national)),
    psiThreshold + 20,
    120
  );
  // Round up to nearest 50
  const yMax = Math.ceil(maxDataVal / 50) * 50;

  // Coordinate helpers
  const getX = (index: number) => padding.left + (index / (history.length - 1)) * chartW;
  const getY = (val: number) => padding.top + chartH - (val / yMax) * chartH;

  // Build SVG path
  const pathD = history.reduce((acc, point, idx) => {
    const val = point[activeKey as Exclude<RegionKey, never>] || 0;
    const x = getX(idx);
    const y = getY(val);
    return idx === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
  }, '');

  // Fill area gradient path
  const areaD = `${pathD} L ${getX(history.length - 1)},${padding.top + chartH} L ${getX(0)},${padding.top + chartH} Z`;

  // Color mapping based on current value
  const latestVal = history[history.length - 1]?.[activeKey as Exclude<RegionKey, never>] || 50;
  const strokeColor =
    latestVal > 300
      ? '#dc2626'
      : latestVal > 200
      ? '#f97316'
      : latestVal > 100
      ? '#f59e0b'
      : latestVal > 50
      ? '#0ea5e9'
      : '#10b981';

  return (
    <div id="trend-section" className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-sm">
      
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-sky-400" />
            <span>24-Hour PSI Trend & Threshold Trajectory</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Hourly 24-hr PSI fluctuations tracked across Singapore monitoring stations.
          </p>
        </div>

        {/* Region Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono">
          {regionKeys.map((k) => (
            <button
              key={k}
              onClick={() => onSelectRegion(k)}
              className={`px-2.5 py-1 rounded transition-colors uppercase ${
                selectedRegion === k
                  ? 'bg-slate-800 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative mt-4 w-full overflow-x-auto">
        <div className="min-w-[620px]">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto select-none overflow-visible"
            onMouseLeave={() => setHoverIndex(null)}
          >
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity="0.35" />
                <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines & Y-Axis Labels */}
            {[0, 50, 100, 200, 300].filter((v) => v <= yMax).map((level) => {
              const y = getY(level);
              return (
                <g key={`y-grid-${level}`}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="#1e293b"
                    strokeDasharray={level === 0 ? undefined : '4 4'}
                    strokeWidth="1"
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    fill="#64748b"
                    fontSize="10"
                    className="font-mono tabular-nums"
                  >
                    {level}
                  </text>
                </g>
              );
            })}

            {/* User Configured Alert Threshold Line */}
            {psiThreshold <= yMax && (
              <g>
                <line
                  x1={padding.left}
                  y1={getY(psiThreshold)}
                  x2={width - padding.right}
                  y2={getY(psiThreshold)}
                  stroke="#ef4444"
                  strokeDasharray="6 4"
                  strokeWidth="1.5"
                />
                <text
                  x={width - padding.right}
                  y={getY(psiThreshold) - 5}
                  textAnchor="end"
                  fill="#ef4444"
                  fontSize="10"
                  fontWeight="bold"
                  className="font-mono"
                >
                  Alert Threshold ({psiThreshold} PSI)
                </text>
              </g>
            )}

            {/* Area Fill */}
            <path d={areaD} fill="url(#trendGradient)" />

            {/* Main Trend Line */}
            <path
              d={pathD}
              fill="none"
              stroke={strokeColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* X-Axis Time Labels */}
            {history.map((pt, idx) => {
              // Show label every 3 hours
              if (idx % 3 !== 0 && idx !== history.length - 1) return null;
              const x = getX(idx);
              const y = padding.top + chartH + 18;

              return (
                <text
                  key={`x-label-${idx}`}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="10"
                  className="font-mono"
                >
                  {pt.timeLabel}
                </text>
              );
            })}

            {/* Interactive Data Points & Hover Triggers */}
            {history.map((pt, idx) => {
              const val = pt[activeKey as Exclude<RegionKey, never>] || 0;
              const x = getX(idx);
              const y = getY(val);
              const isHovered = hoverIndex === idx;

              return (
                <g key={`point-${idx}`}>
                  {/* Invisible wide hover target */}
                  <rect
                    x={x - 12}
                    y={padding.top}
                    width={24}
                    height={chartH}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoverIndex(idx)}
                  />

                  {/* Circle dot on line */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 6 : 3}
                    fill={isHovered ? '#ffffff' : strokeColor}
                    stroke="#0f172a"
                    strokeWidth="2"
                    className="transition-all pointer-events-none"
                  />

                  {/* Hover Tooltip Box */}
                  {isHovered && (
                    <g transform={`translate(${x}, ${Math.max(y - 38, padding.top + 10)})`}>
                      <rect
                        x="-38"
                        y="-18"
                        width="76"
                        height="30"
                        rx="5"
                        fill="#020617"
                        stroke="#475569"
                        strokeWidth="1"
                        className="pointer-events-none shadow-xl"
                      />
                      <text
                        x="0"
                        y="-3"
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="9"
                        className="font-mono pointer-events-none"
                      >
                        {pt.timeLabel} SGT
                      </text>
                      <text
                        x="0"
                        y="9"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="bold"
                        className="font-mono pointer-events-none"
                      >
                        {val} PSI
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: strokeColor }} />
            <span>Region: {activeKey.toUpperCase()}</span>
          </span>
          <span>Latest Reading: <strong className="text-white">{latestVal} PSI</strong></span>
        </div>
        <span>Times displayed in Singapore Standard Time (UTC+8)</span>
      </div>

    </div>
  );
};
