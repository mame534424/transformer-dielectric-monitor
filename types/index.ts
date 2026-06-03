export type HealthStatus =
  | 'EXCELLENT'
  | 'GOOD'
  | 'MARGINAL'
  | 'POOR'
  | 'CRITICAL';

export interface PredictRequest {
  BDV: number;
  Tan_Delta: number;
  Insulation_Resistance: number;
  Capacitance_Variation: number;
  Polarization_Index: number;
  DDF: number;
}

export interface PredictResponse {
  prediction: number;
  status: HealthStatus;
  inputs?: PredictRequest;
}

export interface ChatRequest {
  question: string;
  status?: HealthStatus;
  inputs?: PredictRequest;
}

export interface ChatResponse {
  answer: string;
}

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export type ChatMode = 'general' | 'result';

export interface DiagnosticResultContext {
  status: HealthStatus;
  inputs: PredictRequest;
  prediction: number;
}

export interface SliderConfig {
  key: keyof PredictRequest;
  label: string;
  min: number;
  max: number;
  default: number;
  unit: string;
  step?: number;
}

export const SLIDER_CONFIGS: SliderConfig[] = [
  { key: 'BDV', label: 'Breakdown Voltage', min: 0, max: 100, default: 50, unit: 'kV', step: 1 },
  { key: 'Tan_Delta', label: 'Tan Delta', min: 0, max: 5.0, default: 0.3, unit: '—', step: 0.01 },
  {
    key: 'Insulation_Resistance',
    label: 'Insulation Resistance',
    min: 1,
    max: 5000,
    default: 500,
    unit: 'MΩ',
    step: 10,
  },
  {
    key: 'Capacitance_Variation',
    label: 'Capacitance Variation',
    min: -10,
    max: 15,
    default: 0,
    unit: '%',
    step: 0.1,
  },
  {
    key: 'Polarization_Index',
    label: 'Polarization Index',
    min: 0.5,
    max: 5,
    default: 3.0,
    unit: '—',
    step: 0.05,
  },
  { key: 'DDF', label: 'Dielectric Dissipation Factor', min: 0.1, max: 5, default: 0.3, unit: '—', step: 0.01 },
];

export const STATUS_COLORS: Record<HealthStatus, string> = {
  EXCELLENT: '#00ff88',
  GOOD: '#00cfff',
  MARGINAL: '#ffaa00',
  POOR: '#ff4444',
  CRITICAL: '#ff0000',
};

export function predictionToPercent(prediction: number): number {
  if (prediction <= 1) return Math.round(prediction * 100);
  return Math.round(Math.min(100, Math.max(0, prediction)));
}

export function confidenceFromPrediction(prediction: number): number {
  const pct = predictionToPercent(prediction);
  return Math.round(Math.min(100, Math.max(0, 100 - pct * 0.3)));
}

export function riskColor(percent: number): string {
  if (percent < 20) return '#00ff88';
  if (percent < 40) return '#7fff7f';
  if (percent < 60) return '#ffdd00';
  if (percent < 80) return '#ff8800';
  return '#ff2222';
}
