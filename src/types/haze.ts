export type RegionKey = 'north' | 'south' | 'east' | 'west' | 'central' | 'national';

export interface RegionalReading {
  region: RegionKey;
  label: string;
  towns: string[];
  psi24Hourly: number;
  pm25OneHourly: number;
  pm25TwentyFourHourly: number;
  pm10TwentyFourHourly: number;
  so2TwentyFourHourly: number;
  no2OneHourMax: number;
  o3EightHourMax: number;
  coEightHourMax: number;
  trend: 'rising' | 'steady' | 'falling';
  delta: number;
  updatedAt: string;
}

export type PsiBand = 'good' | 'moderate' | 'unhealthy' | 'very_unhealthy' | 'hazardous';

export interface PsiBandInfo {
  band: PsiBand;
  label: string;
  min: number;
  max: number;
  colorHex: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  badgeClass: string;
  summary: string;
  generalAdvisory: string;
  vulnerableAdvisory: string;
  n95Recommended: boolean;
}

export interface HotspotData {
  sumatraHotspots: number;
  kalimantanHotspots: number;
  prevailingWind: string;
  windSpeedKmh: number;
  asmcHazeAlertLevel: 1 | 2 | 3;
  hazeOutlook: string;
}

export interface AlertConfig {
  enabled: boolean;
  psiThreshold: number; // e.g. 101, 150, 200, 300
  pm25Threshold: number; // e.g. 55, 100, 150
  selectedRegions: RegionKey[];
  soundEnabled: boolean;
  browserNotifications: boolean;
  hazardSirenActive: boolean;
}

export interface HistoricalDataPoint {
  timeLabel: string;
  timestamp: string;
  north: number;
  south: number;
  east: number;
  west: number;
  central: number;
  national: number;
}

export interface HazeDataState {
  lastUpdated: string;
  isLive: boolean;
  isSimulated: boolean;
  simulationScenario?: 'normal' | 'moderate' | 'unhealthy' | 'hazardous';
  readings: Record<RegionKey, RegionalReading>;
  history24h: HistoricalDataPoint[];
  hotspot: HotspotData;
}
