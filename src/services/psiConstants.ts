import { PsiBand, PsiBandInfo, RegionKey } from '../types/haze';

export const PSI_BANDS: Record<PsiBand, PsiBandInfo> = {
  good: {
    band: 'good',
    label: 'Good',
    min: 0,
    max: 50,
    colorHex: '#10B981', // Emerald 500
    bgClass: 'bg-emerald-950/40',
    borderClass: 'border-emerald-500/40',
    textClass: 'text-emerald-400',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    summary: 'Air quality is normal. Minimal to no health risk.',
    generalAdvisory: 'Normal outdoor activities can be carried out by everyone.',
    vulnerableAdvisory: 'Normal outdoor activities are safe.',
    n95Recommended: false,
  },
  moderate: {
    band: 'moderate',
    label: 'Moderate',
    min: 51,
    max: 100,
    colorHex: '#0EA5E9', // Sky 500
    bgClass: 'bg-sky-950/40',
    borderClass: 'border-sky-500/40',
    textClass: 'text-sky-400',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    summary: 'Air quality is acceptable. Fine for general public.',
    generalAdvisory: 'Normal outdoor activities. Stay hydrated.',
    vulnerableAdvisory: 'Persons with respiratory ailments should monitor symptoms.',
    n95Recommended: false,
  },
  unhealthy: {
    band: 'unhealthy',
    label: 'Unhealthy',
    min: 101,
    max: 200,
    colorHex: '#F59E0B', // Amber 500
    bgClass: 'bg-amber-950/40',
    borderClass: 'border-amber-500/40',
    textClass: 'text-amber-400',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    summary: 'Air quality reached unhealthy threshold. Prolonged outdoor exertion should be reduced.',
    generalAdvisory: 'Reduce prolonged or strenuous outdoor physical exertion.',
    vulnerableAdvisory: 'Avoid prolonged outdoor exertion. Sensitive individuals should stay indoors.',
    n95Recommended: false,
  },
  very_unhealthy: {
    band: 'very_unhealthy',
    label: 'Very Unhealthy',
    min: 201,
    max: 300,
    colorHex: '#F97316', // Orange 500 / Rose
    bgClass: 'bg-orange-950/40',
    borderClass: 'border-orange-500/40',
    textClass: 'text-orange-400',
    badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    summary: 'Significant haze hazard. Active warnings triggered across the region.',
    generalAdvisory: 'Avoid prolonged or strenuous outdoor physical exertion. Wear N95 if outdoors.',
    vulnerableAdvisory: 'Avoid outdoor activities. Stay indoors with air purifiers active.',
    n95Recommended: true,
  },
  hazardous: {
    band: 'hazardous',
    label: 'Hazardous',
    min: 301,
    max: 500,
    colorHex: '#DC2626', // Crimson 600
    bgClass: 'bg-red-950/60',
    borderClass: 'border-red-600/70',
    textClass: 'text-red-400',
    badgeClass: 'bg-red-600/25 text-red-200 border-red-500/50',
    summary: 'EMERGENCY: Hazardous air quality. Severe risk for the general population.',
    generalAdvisory: 'AVOID all outdoor activity. Remain indoors with windows closed and HEPA filtration.',
    vulnerableAdvisory: 'Strictly avoid outdoor exposure. Seek medical attention if breathing difficulties occur.',
    n95Recommended: true,
  },
};

export function getPsiBand(psi: number): PsiBandInfo {
  if (psi <= 50) return PSI_BANDS.good;
  if (psi <= 100) return PSI_BANDS.moderate;
  if (psi <= 200) return PSI_BANDS.unhealthy;
  if (psi <= 300) return PSI_BANDS.very_unhealthy;
  return PSI_BANDS.hazardous;
}

export function getPm25Band(pm25: number): { label: string; band: string; color: string; advice: string } {
  if (pm25 <= 55) {
    return { label: 'Normal (Band I)', band: 'normal', color: 'text-emerald-400', advice: 'Safe for all outdoor activities' };
  }
  if (pm25 <= 150) {
    return { label: 'Elevated (Band II)', band: 'elevated', color: 'text-sky-400', advice: 'Normal outdoor activities for healthy people' };
  }
  if (pm25 <= 250) {
    return { label: 'High (Band III)', band: 'high', color: 'text-amber-400', advice: 'Reduce strenuous outdoor exertion' };
  }
  return { label: 'Very High (Band IV)', band: 'very_high', color: 'text-red-400', advice: 'Avoid strenuous outdoor activities' };
}

export const REGION_DETAILS: Record<RegionKey, { label: string; short: string; towns: string[]; centerCoord: { x: number; y: number } }> = {
  north: {
    label: 'North Region',
    short: 'North',
    towns: ['Woodlands', 'Yishun', 'Sembawang', 'Mandai', 'Seletar', 'Simpang'],
    centerCoord: { x: 300, y: 80 },
  },
  south: {
    label: 'South Region',
    short: 'South',
    towns: ['Marina Bay', 'Sentosa', 'Telok Blangah', 'Bukit Merah', 'Queenstown', 'Tanjong Pagar', 'HarbourFront'],
    centerCoord: { x: 310, y: 285 },
  },
  east: {
    label: 'East Region',
    short: 'East',
    towns: ['Tampines', 'Bedok', 'Pasir Ris', 'Changi', 'Paya Lebar', 'Pulau Ubin', 'Pulau Tekong'],
    centerCoord: { x: 470, y: 175 },
  },
  west: {
    label: 'West Region',
    short: 'West',
    towns: ['Jurong East', 'Jurong West', 'Tuas', 'Pioneer', 'Clementi', 'Bukit Batok', 'Choa Chu Kang', 'Jurong Island'],
    centerCoord: { x: 135, y: 185 },
  },
  central: {
    label: 'Central Region',
    short: 'Central',
    towns: ['Bishan', 'Ang Mo Kio', 'Toa Payoh', 'Novena', 'Orchard', 'Bukit Timah', 'Kallang'],
    centerCoord: { x: 300, y: 175 },
  },
  national: {
    label: 'National Average',
    short: 'National',
    towns: ['Islandwide Average across all 5 NEA air monitoring stations'],
    centerCoord: { x: 300, y: 180 },
  },
};
