import React, { useState } from 'react';
import { X, ShieldCheck, AlertCircle, Heart, User, Sparkles, Check, AlertTriangle } from 'lucide-react';
import { PSI_BANDS } from '../services/psiConstants';

interface HealthAdvisoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMaxPsi: number;
}

export const HealthAdvisoryModal: React.FC<HealthAdvisoryModalProps> = ({
  isOpen,
  onClose,
  currentMaxPsi,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<'healthy' | 'vulnerable' | 'chronic'>('healthy');
  const [selectedActivity, setSelectedActivity] = useState<'strenuous' | 'moderate' | 'light'>('strenuous');

  if (!isOpen) return null;

  // Compute recommendation based on current max PSI
  const getRecommendation = () => {
    if (currentMaxPsi <= 50) {
      return {
        verdict: 'Normal Activities Permitted',
        status: 'safe',
        color: 'text-emerald-400',
        bg: 'bg-emerald-950/40 border-emerald-500/40',
        text: 'Air quality is Good. No activity restrictions apply for any group.',
      };
    }
    if (currentMaxPsi <= 100) {
      if (selectedGroup === 'chronic') {
        return {
          verdict: 'Monitor Symptoms',
          status: 'caution',
          color: 'text-sky-400',
          bg: 'bg-sky-950/40 border-sky-500/40',
          text: 'Air quality is Moderate. Normal activities for most, but individuals with asthma or COPD should carry reliever medication.',
        };
      }
      return {
        verdict: 'Normal Activities Permitted',
        status: 'safe',
        color: 'text-sky-400',
        bg: 'bg-sky-950/40 border-sky-500/40',
        text: 'Air quality is Moderate. Safe for all outdoor activities.',
      };
    }
    if (currentMaxPsi <= 200) {
      if (selectedGroup === 'healthy') {
        if (selectedActivity === 'strenuous') {
          return {
            verdict: 'Reduce Strenuous Outdoor Exertion',
            status: 'warning',
            color: 'text-amber-400',
            bg: 'bg-amber-950/40 border-amber-500/40',
            text: 'Unhealthy Air Quality (PSI 101-200). Healthy individuals should reduce prolonged or strenuous outdoor exercise (e.g. running, HIIT, outdoor football).',
          };
        }
        return {
          verdict: 'Proceed With Normal Precaution',
          status: 'moderate',
          color: 'text-amber-400',
          bg: 'bg-amber-950/40 border-amber-500/40',
          text: 'Normal daily activities like commuting and walking are fine for healthy individuals.',
        };
      }
      // Vulnerable or Chronic
      return {
        verdict: 'Avoid Outdoor Exertion',
        status: 'alert',
        color: 'text-orange-400',
        bg: 'bg-orange-950/40 border-orange-500/40',
        text: 'Unhealthy air. Elderly, pregnant women, and children should minimize outdoor activities. Persons with heart/lung disease should stay indoors.',
      };
    }
    if (currentMaxPsi <= 300) {
      return {
        verdict: 'AVOID OUTDOOR ACTIVITY · N95 RECOMMENDED',
        status: 'hazard',
        color: 'text-red-400',
        bg: 'bg-red-950/50 border-red-500/60',
        text: 'Very Unhealthy (PSI 201-300). Healthy people should avoid strenuous outdoor exertion. Vulnerable groups must stay indoors. N95 respirator masks recommended for outdoor transit.',
      };
    }
    // Hazardous > 300
    return {
      verdict: 'HAZARDOUS CRISIS · REMAIN INDOORS',
      status: 'critical',
      color: 'text-red-500',
      bg: 'bg-red-950/80 border-red-600',
      text: 'HAZARDOUS (> 300 PSI). Severe health risk. Everyone should avoid outdoor activities. Keep windows and doors closed. Run HEPA air purifiers continuously.',
    };
  };

  const rec = getRecommendation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block">
              Ministry of Health (MOH) & NEA Guidelines
            </span>
            <h3 className="text-lg font-bold text-white">
              Singapore Haze Health Advisory & Protective Measures
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Interactive Activity Calculator */}
        <div className="mt-5 p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">
              Personalized Activity Guidance Engine
            </h4>
            <span className="text-xs font-mono text-slate-400 ml-auto">
              Current Peak PSI: <strong className="text-white">{currentMaxPsi}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Step 1: Demographic Group */}
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1.5">
                1. Select Target Profile:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setSelectedGroup('healthy')}
                  className={`p-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                    selectedGroup === 'healthy'
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <User className="h-4 w-4 mx-auto mb-1 text-emerald-400" />
                  Healthy
                </button>
                <button
                  onClick={() => setSelectedGroup('vulnerable')}
                  className={`p-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                    selectedGroup === 'vulnerable'
                      ? 'border-amber-500 bg-amber-950/40 text-amber-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="h-4 w-4 mx-auto mb-1 text-amber-400" />
                  Elderly/Child
                </button>
                <button
                  onClick={() => setSelectedGroup('chronic')}
                  className={`p-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                    selectedGroup === 'chronic'
                      ? 'border-red-500 bg-red-950/40 text-red-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <Heart className="h-4 w-4 mx-auto mb-1 text-red-400" />
                  Heart/Lung
                </button>
              </div>
            </div>

            {/* Step 2: Activity Level */}
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1.5">
                2. Planned Activity:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setSelectedActivity('strenuous')}
                  className={`p-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                    selectedActivity === 'strenuous'
                      ? 'border-white bg-slate-800 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  Strenuous (Run/Sports)
                </button>
                <button
                  onClick={() => setSelectedActivity('moderate')}
                  className={`p-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                    selectedActivity === 'moderate'
                      ? 'border-white bg-slate-800 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  Moderate (Commute)
                </button>
                <button
                  onClick={() => setSelectedActivity('light')}
                  className={`p-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                    selectedActivity === 'light'
                      ? 'border-white bg-slate-800 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  Light / Indoor
                </button>
              </div>
            </div>
          </div>

          {/* Instant Recommendation Output */}
          <div className={`mt-3.5 p-3 rounded-lg border ${rec.bg}`}>
            <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wide">
              <AlertTriangle className={`h-4 w-4 ${rec.color}`} />
              <span className={rec.color}>{rec.verdict}</span>
            </div>
            <p className="mt-1 text-xs text-slate-200 leading-relaxed">
              {rec.text}
            </p>
          </div>
        </div>

        {/* Official NEA Scale Matrix */}
        <div className="mt-5">
          <h4 className="text-sm font-bold text-white mb-2">
            Singapore MOH / NEA Official Advisory Table
          </h4>
          <div className="overflow-x-auto rounded-lg border border-slate-800 text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-900 border-b border-slate-800 font-mono text-slate-400">
                <tr>
                  <th className="p-2.5">PSI Band</th>
                  <th className="p-2.5">Healthy Persons</th>
                  <th className="p-2.5">Elderly, Pregnant & Children</th>
                  <th className="p-2.5">Persons with Chronic Disease</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                <tr>
                  <td className="p-2.5 font-bold font-mono text-emerald-400">0 - 50 (Good)</td>
                  <td className="p-2.5 text-slate-300">Normal activities</td>
                  <td className="p-2.5 text-slate-300">Normal activities</td>
                  <td className="p-2.5 text-slate-300">Normal activities</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold font-mono text-sky-400">51 - 100 (Moderate)</td>
                  <td className="p-2.5 text-slate-300">Normal activities</td>
                  <td className="p-2.5 text-slate-300">Normal activities</td>
                  <td className="p-2.5 text-slate-300">Monitor breathing symptoms</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold font-mono text-amber-400">101 - 200 (Unhealthy)</td>
                  <td className="p-2.5 text-slate-300">Reduce prolonged or strenuous outdoor exertion</td>
                  <td className="p-2.5 text-slate-300">Minimize prolonged outdoor physical exertion</td>
                  <td className="p-2.5 text-slate-300">Avoid outdoor exertion; remain indoors</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold font-mono text-orange-400">201 - 300 (Very Unhealthy)</td>
                  <td className="p-2.5 text-slate-300">Avoid strenuous outdoor exertion; wear N95 if outdoors</td>
                  <td className="p-2.5 text-slate-300">Avoid outdoor activities</td>
                  <td className="p-2.5 text-slate-300">Remain indoors; keep windows closed</td>
                </tr>
                <tr className="bg-red-950/20">
                  <td className="p-2.5 font-bold font-mono text-red-400">&gt; 300 (Hazardous)</td>
                  <td className="p-2.5 text-slate-200 font-semibold">Minimize all outdoor activities; N95 mandatory</td>
                  <td className="p-2.5 text-slate-200 font-semibold">Strictly stay indoors with air purifier</td>
                  <td className="p-2.5 text-slate-200 font-semibold">Strict indoor isolation; seek medical advice if unwell</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* N95 Respirator Guidance */}
        <div className="mt-5 p-4 rounded-xl border border-slate-800 bg-slate-900/40">
          <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-400" />
            <span>N95 Respirator Guidance (Singapore MOH Standards)</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 leading-relaxed">
            <div>
              <strong className="text-white block mb-1">N95 Masks vs Surgical Masks:</strong>
              Surgical masks and cloth masks DO NOT filter fine PM2.5 haze particles effectively because air leaks through the gaps. Only certified N95 respirators with a tight facial seal are designed to filter $\ge 95\%$ of airborne particles.
            </div>
            <div>
              <strong className="text-white block mb-1">Who Should Take Caution:</strong>
              N95 masks increase the effort of breathing. Elderly individuals, persons with severe reduced lung function (COPD, severe asthma), or women in their 3rd trimester of pregnancy should consult a doctor before wearing an N95 for long durations.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
