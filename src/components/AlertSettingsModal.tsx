import React from 'react';
import { X, Bell, Volume2, VolumeX, ShieldAlert, Check, Play } from 'lucide-react';
import { AlertConfig, RegionKey } from '../types/haze';
import { REGION_DETAILS } from '../services/psiConstants';

interface AlertSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AlertConfig;
  onChangeConfig: (newConfig: AlertConfig) => void;
  onTestChime: () => void;
  onTestHazardAlarm: () => void;
}

export const AlertSettingsModal: React.FC<AlertSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
  onTestChime,
  onTestHazardAlarm,
}) => {
  if (!isOpen) return null;

  const regions: RegionKey[] = ['north', 'south', 'east', 'west', 'central'];

  const toggleRegion = (reg: RegionKey) => {
    const exists = config.selectedRegions.includes(reg);
    const updated = exists
      ? config.selectedRegions.filter((r) => r !== reg)
      : [...config.selectedRegions, reg];
    onChangeConfig({ ...config, selectedRegions: updated });
  };

  const selectAllRegions = () => {
    onChangeConfig({ ...config, selectedRegions: [...regions] });
  };

  const handleRequestNotification = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      onChangeConfig({
        ...config,
        browserNotifications: perm === 'granted',
      });
      if (perm === 'granted') {
        new Notification('SG HazeWatch Alerts Activated', {
          body: `You will be alerted whenever PSI exceeds ${config.psiThreshold}.`,
          icon: '/favicon.ico',
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Air Quality & Hazard Alert Settings
              </h3>
              <p className="text-xs text-slate-400">
                Configure instant warnings when Singapore PSI or PM2.5 crosses hazardous thresholds.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-6">
          
          {/* 1. PSI Threshold Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                PSI Trigger Threshold
              </label>
              <span className="text-sm font-bold font-mono text-emerald-400">
                &gt; {config.psiThreshold} PSI
              </span>
            </div>

            {/* Threshold Preset Buttons */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              {[
                { val: 100, label: 'Unhealthy (>100)' },
                { val: 150, label: 'Elevated (>150)' },
                { val: 200, label: 'Very Unhealthy (>200)' },
                { val: 300, label: 'Hazardous (>300)' },
              ].map((preset) => (
                <button
                  key={preset.val}
                  onClick={() => onChangeConfig({ ...config, psiThreshold: preset.val })}
                  className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
                    config.psiThreshold === preset.val
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Slider */}
            <input
              type="range"
              min="50"
              max="350"
              step="5"
              value={config.psiThreshold}
              onChange={(e) =>
                onChangeConfig({ ...config, psiThreshold: parseInt(e.target.value, 10) })
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>50 (Moderate)</span>
              <span>100 (Unhealthy)</span>
              <span>200 (Very Unhealthy)</span>
              <span>300+ (Hazardous)</span>
            </div>
          </div>

          {/* 2. Target Monitored Regions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                Monitored Regions in Singapore
              </label>
              <button
                onClick={selectAllRegions}
                className="text-xs text-emerald-400 hover:underline font-mono"
              >
                Select All
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {regions.map((reg) => {
                const isChecked = config.selectedRegions.includes(reg);
                return (
                  <button
                    key={reg}
                    onClick={() => toggleRegion(reg)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-medium transition-all ${
                      isChecked
                        ? 'border-emerald-500/80 bg-emerald-950/30 text-white'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{REGION_DETAILS[reg].short} Region</span>
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded border ${
                        isChecked
                          ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                          : 'border-slate-700 bg-slate-950'
                      }`}
                    >
                      {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Alerts will only trigger when air quality crosses the threshold in one of your selected regions.
            </p>
          </div>

          {/* 3. Audio & Notification Options */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-3.5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-2">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
              <span>Alarm & Notification Delivery</span>
            </h4>

            {/* Sound Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">
                  Audio Alert Siren & Chimes
                </span>
                <span className="text-[11px] text-slate-400">
                  Plays audio chime when thresholds are breached.
                </span>
              </div>
              <button
                onClick={() => onChangeConfig({ ...config, soundEnabled: !config.soundEnabled })}
                className={`p-2 rounded-lg border transition-colors ${
                  config.soundEnabled
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-400'
                    : 'border-slate-800 bg-slate-950 text-slate-500'
                }`}
              >
                {config.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
            </div>

            {/* Test Alarm Buttons */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
              <button
                onClick={onTestChime}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Play className="h-3 w-3 text-emerald-400" />
                <span>Test Chime</span>
              </button>
              <button
                onClick={onTestHazardAlarm}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/40 bg-red-950/30 text-xs font-medium text-red-300 hover:text-white hover:bg-red-900/40 transition-colors"
              >
                <Play className="h-3 w-3 text-red-400" />
                <span>Test Hazard Siren</span>
              </button>
            </div>

            {/* Browser Notifications */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <div>
                <span className="text-xs font-bold text-white block">
                  Browser Push Notifications
                </span>
                <span className="text-[11px] text-slate-400">
                  Receive background desktop/device alerts.
                </span>
              </div>
              <button
                onClick={handleRequestNotification}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  config.browserNotifications
                    ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                    : 'border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {config.browserNotifications ? 'Enabled' : 'Enable in Browser'}
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() =>
              onChangeConfig({
                enabled: true,
                psiThreshold: 100,
                pm25Threshold: 55,
                selectedRegions: ['north', 'south', 'east', 'west', 'central'],
                soundEnabled: true,
                browserNotifications: false,
                hazardSirenActive: false,
              })
            }
            className="text-xs text-slate-500 hover:text-slate-300 font-mono underline"
          >
            Reset to Defaults
          </button>
          <button
            onClick={onClose}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
          >
            Save Preferences
          </button>
        </div>

      </div>
    </div>
  );
};
