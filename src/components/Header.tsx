import React from 'react';
import { Bell, RefreshCw, Sliders, ShieldAlert, Radio } from 'lucide-react';

interface HeaderProps {
  onOpenAlertSettings: () => void;
  onOpenHealthAdvisory: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  activeAlertCount: number;
  isSimulated: boolean;
  isLive: boolean;
  lastUpdated: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAlertSettings,
  onOpenHealthAdvisory,
  onRefresh,
  isRefreshing,
  activeAlertCount,
  isSimulated,
  isLive,
  lastUpdated,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single text element Brand Zone */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white block leading-tight">
              SG HazeWatch
            </span>
            <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${isSimulated ? 'bg-amber-400' : isLive ? 'bg-emerald-400' : 'bg-sky-400'}`} />
              {isSimulated ? 'Simulated Mode' : isLive ? 'Gov.sg Live NEA' : 'NEA Baseline'} · {lastUpdated}
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <a href="#map-section" className="hover:text-white transition-colors">
            Regional Map
          </a>
          <a href="#regions-grid" className="hover:text-white transition-colors">
            5 Regions
          </a>
          <a href="#trend-section" className="hover:text-white transition-colors">
            24h Trends
          </a>
          <a href="#hotspot-section" className="hover:text-white transition-colors">
            Transboundary Hotspots
          </a>
          <button
            onClick={onOpenHealthAdvisory}
            className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-slate-300"
          >
            <ShieldAlert className="h-4 w-4 text-emerald-400" />
            Health Guide
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors disabled:opacity-50"
            title="Refresh NEA data"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={onOpenAlertSettings}
            className={`relative flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeAlertCount > 0
                ? 'bg-red-600 text-white shadow-lg shadow-red-950/50 hover:bg-red-500 animate-pulse'
                : 'border border-slate-700 bg-slate-800/90 text-slate-200 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Bell className="h-3.5 w-3.5" />
            <span>Alerts</span>
            {activeAlertCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-red-600 font-mono">
                {activeAlertCount}
              </span>
            )}
            <Sliders className="h-3.5 w-3.5 opacity-60 ml-0.5" />
          </button>
        </div>

      </div>
    </header>
  );
};
