/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { HazardAlertBanner } from './components/HazardAlertBanner';
import { HazeSimulatorBar } from './components/HazeSimulatorBar';
import { SingaporeMap } from './components/SingaporeMap';
import { RegionSelector } from './components/RegionSelector';
import { RegionalCardGrid } from './components/RegionalCardGrid';
import { PollutantBreakdown } from './components/PollutantBreakdown';
import { TrendHistoryChart } from './components/TrendHistoryChart';
import { TransboundaryHotspots } from './components/TransboundaryHotspots';
import { HealthAdvisoryModal } from './components/HealthAdvisoryModal';
import { AlertSettingsModal } from './components/AlertSettingsModal';
import { AlertConfig, HazeDataState, RegionKey } from './types/haze';
import { fetchLiveNeaData, generateSimulatedScenario } from './services/neaService';
import { playHazardAlarm, playWarningChime } from './services/soundAlert';
import { getPsiBand, REGION_DETAILS } from './services/psiConstants';
import { ShieldAlert, AlertTriangle, Wind, Info, MapPin } from 'lucide-react';

export default function App() {
  // Main Data State
  const [dataState, setDataState] = useState<HazeDataState>(() => generateSimulatedScenario('moderate'));
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>('central');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // User Alert Configuration State
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    enabled: true,
    psiThreshold: 100, // Alerts when PSI exceeds Unhealthy threshold (>100)
    pm25Threshold: 55,
    selectedRegions: ['north', 'south', 'east', 'west', 'central'],
    soundEnabled: true,
    browserNotifications: false,
    hazardSirenActive: false,
  });

  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [isAlertSettingsOpen, setIsAlertSettingsOpen] = useState(false);
  const [isHealthAdvisoryOpen, setIsHealthAdvisoryOpen] = useState(false);

  // Keep track of last alerted threshold to prevent audio spam
  const lastAlertTimeRef = useRef<number>(0);

  // Load live data from NEA on initial mount
  const loadLiveData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const liveData = await fetchLiveNeaData();
      setDataState(liveData);
    } catch (err) {
      console.error('Failed to load NEA live data:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadLiveData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      if (!dataState.isSimulated) {
        loadLiveData();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [loadLiveData, dataState.isSimulated]);

  // Handle Simulation Switches
  const handleScenarioChange = (scenario: 'normal' | 'moderate' | 'unhealthy' | 'hazardous') => {
    const simState = generateSimulatedScenario(scenario);
    setDataState(simState);

    // If switching to hazardous or unhealthy, trigger alert chime / siren
    if (scenario === 'hazardous' && !isSoundMuted && alertConfig.soundEnabled) {
      playHazardAlarm();
    } else if (scenario === 'unhealthy' && !isSoundMuted && alertConfig.soundEnabled) {
      playWarningChime();
    }
  };

  // Breached regions calculation
  const breachingRegions = Object.values(dataState.readings).filter((r) => {
    if (r.region === 'national') return false;
    const isSelected = alertConfig.selectedRegions.includes(r.region);
    const exceedsPsi = r.psi24Hourly > alertConfig.psiThreshold;
    return isSelected && exceedsPsi;
  });

  const maxBreachPsi = breachingRegions.length > 0
    ? Math.max(...breachingRegions.map((r) => r.psi24Hourly))
    : 0;

  // Sound triggering on data update
  useEffect(() => {
    const now = Date.now();
    if (breachingRegions.length > 0 && !isSoundMuted && alertConfig.soundEnabled) {
      // Don't fire audio more frequently than once every 10 seconds
      if (now - lastAlertTimeRef.current > 10000) {
        lastAlertTimeRef.current = now;
        if (maxBreachPsi > 300) {
          playHazardAlarm();
        } else {
          playWarningChime();
        }
      }
    }
  }, [breachingRegions, maxBreachPsi, isSoundMuted, alertConfig.soundEnabled]);

  // Find region with peak PSI
  const regionalList = (['north', 'south', 'east', 'west', 'central'] as RegionKey[]).map(
    (k) => dataState.readings[k]
  );
  const peakRegion = regionalList.reduce((max, cur) => (cur.psi24Hourly > max.psi24Hourly ? cur : max), regionalList[0]);
  const nationalReading = dataState.readings.national;
  const nationalBand = getPsiBand(nationalReading.psi24Hourly);
  const peakBand = getPsiBand(peakRegion.psi24Hourly);

  const selectedReading = dataState.readings[selectedRegion] || nationalReading;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* 1. Header (Follows Top Bar Contract) */}
      <Header
        onOpenAlertSettings={() => setIsAlertSettingsOpen(true)}
        onOpenHealthAdvisory={() => setIsHealthAdvisoryOpen(true)}
        onRefresh={loadLiveData}
        isRefreshing={isRefreshing}
        activeAlertCount={breachingRegions.length}
        isSimulated={dataState.isSimulated}
        isLive={dataState.isLive}
        lastUpdated={dataState.lastUpdated}
      />

      {/* 2. Critical Alert Banner (Visible when any monitored region crosses threshold) */}
      <HazardAlertBanner
        breachingRegions={breachingRegions}
        psiThreshold={alertConfig.psiThreshold}
        onOpenAdvisory={() => setIsHealthAdvisoryOpen(true)}
        onPlayAlarm={playHazardAlarm}
        isSoundMuted={isSoundMuted}
        onToggleSound={() => setIsSoundMuted(!isSoundMuted)}
      />

      {/* 3. Haze Test Simulator Bar (Immediate testability for hazardous thresholds) */}
      <HazeSimulatorBar
        currentScenario={dataState.simulationScenario}
        isLive={dataState.isLive}
        onSelectScenario={handleScenarioChange}
        onResetToLive={loadLiveData}
      />

      {/* 4. Main Viewport Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Islandwide KPI Scoreboard */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          {/* Islandwide 24-hr PSI */}
          <div className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-4 backdrop-blur-sm">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              National 24-hr PSI
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className={`text-3xl font-extrabold font-mono tabular-nums ${nationalBand.textClass}`}>
                  {nationalReading.psi24Hourly}
                </span>
                <span className="text-xs text-slate-500 font-mono">PSI</span>
              </div>
              <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded border ${nationalBand.badgeClass}`}>
                {nationalBand.label}
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-400 truncate">
              NEA 24-hr mean across all monitoring stations
            </p>
          </div>

          {/* Peak Regional Hotspot */}
          <div className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-4 backdrop-blur-sm">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              Highest Regional PSI
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className={`text-3xl font-extrabold font-mono tabular-nums ${peakBand.textClass}`}>
                  {peakRegion.psi24Hourly}
                </span>
                <span className="text-xs text-slate-500 font-mono">PSI</span>
              </div>
              <span className="text-xs font-bold text-white font-mono flex items-center gap-1">
                <MapPin className="h-3 w-3 text-red-400" />
                {peakRegion.label}
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-400 truncate">
              Towns: {peakRegion.towns.slice(0, 3).join(', ')}
            </p>
          </div>

          {/* Real-time 1-hr PM2.5 Max */}
          <div className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-4 backdrop-blur-sm">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              Max 1-hr PM2.5 (Real-Time)
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold font-mono tabular-nums text-white">
                  {Math.max(...regionalList.map((r) => r.pm25OneHourly))}
                </span>
                <span className="text-xs text-slate-500 font-mono">µg/m³</span>
              </div>
              <span className="text-xs text-emerald-400 font-mono">
                Real-Time Guide
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-400 truncate">
              Immediate indicator for outdoor sports & jogs
            </p>
          </div>

          {/* Alert Status Indicator */}
          <div
            className={`rounded-xl border p-4 backdrop-blur-sm transition-all ${
              breachingRegions.length > 0
                ? 'border-red-500/60 bg-red-950/30'
                : 'border-slate-800/90 bg-slate-900/60'
            }`}
          >
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              Hazard Warning Status
            </span>
            <div className="mt-1 flex items-center justify-between">
              <span
                className={`text-base font-bold font-mono ${
                  breachingRegions.length > 0 ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {breachingRegions.length > 0
                  ? `${breachingRegions.length} Regions Exceeded`
                  : 'All Regions Nominal'}
              </span>
              {breachingRegions.length > 0 ? (
                <AlertTriangle className="h-5 w-5 text-red-400 animate-pulse" />
              ) : (
                <ShieldAlert className="h-5 w-5 text-emerald-400" />
              )}
            </div>
            <p className="mt-2 text-[11px] text-slate-400 truncate">
              Alert configured for PSI &gt; {alertConfig.psiThreshold}
            </p>
          </div>

        </section>

        {/* Town Search & Region Filter Bar */}
        <section>
          <RegionSelector
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
            readings={dataState.readings}
            psiThreshold={alertConfig.psiThreshold}
          />
        </section>

        {/* Interactive Singapore SVG Map */}
        <section id="map-section">
          <SingaporeMap
            readings={dataState.readings}
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
            psiThreshold={alertConfig.psiThreshold}
            prevailingWind={dataState.hotspot.prevailingWind}
          />
        </section>

        {/* 5 Regions Grid */}
        <section>
          <RegionalCardGrid
            readings={dataState.readings}
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
            psiThreshold={alertConfig.psiThreshold}
          />
        </section>

        {/* Detailed Pollutant Sub-Index Matrix for Selected Region */}
        <section>
          <PollutantBreakdown reading={selectedReading} />
        </section>

        {/* 24-Hour Trend & Trajectory Chart */}
        <section>
          <TrendHistoryChart
            history={dataState.history24h}
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
            psiThreshold={alertConfig.psiThreshold}
          />
        </section>

        {/* Transboundary Hotspots & Satellite Tracking */}
        <section>
          <TransboundaryHotspots hotspot={dataState.hotspot} />
        </section>

        {/* Singapore Air Quality Advisory Banner */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Singapore Ministry of Health (MOH) Health Protocols
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed max-w-2xl">
                Wondering whether to carry out strenuous outdoor runs or send children for outdoor activities? Check the MOH matrix for vulnerable and healthy populations.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsHealthAdvisoryOpen(true)}
            className="shrink-0 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-sm"
          >
            Open Health Guidebook
          </button>
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            Singapore Haze & PSI Telemetry · Grounded in official NEA & data.gov.sg APIs
          </span>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsHealthAdvisoryOpen(true)}
              className="hover:text-white transition-colors"
            >
              MOH Health Guide
            </button>
            <button
              onClick={() => setIsAlertSettingsOpen(true)}
              className="hover:text-white transition-colors"
            >
              Threshold Preferences
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <HealthAdvisoryModal
        isOpen={isHealthAdvisoryOpen}
        onClose={() => setIsHealthAdvisoryOpen(false)}
        currentMaxPsi={peakRegion.psi24Hourly}
      />

      <AlertSettingsModal
        isOpen={isAlertSettingsOpen}
        onClose={() => setIsAlertSettingsOpen(false)}
        config={alertConfig}
        onChangeConfig={setAlertConfig}
        onTestChime={playWarningChime}
        onTestHazardAlarm={playHazardAlarm}
      />

    </div>
  );
}
