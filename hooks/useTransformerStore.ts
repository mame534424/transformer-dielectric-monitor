'use client';

import { create } from 'zustand';
import { predict, getApiErrorMessage } from '@/lib/api';
import type { HealthStatus, PredictRequest, DiagnosticResultContext } from '@/types';
import { SLIDER_CONFIGS } from '@/types';

const defaults: PredictRequest = {
  BDV: SLIDER_CONFIGS.find((c) => c.key === 'BDV')!.default,
  Tan_Delta: SLIDER_CONFIGS.find((c) => c.key === 'Tan_Delta')!.default,
  Insulation_Resistance: SLIDER_CONFIGS.find((c) => c.key === 'Insulation_Resistance')!.default,
  Capacitance_Variation: SLIDER_CONFIGS.find((c) => c.key === 'Capacitance_Variation')!.default,
  Polarization_Index: SLIDER_CONFIGS.find((c) => c.key === 'Polarization_Index')!.default,
  DDF: SLIDER_CONFIGS.find((c) => c.key === 'DDF')!.default,
};

interface TransformerStore extends PredictRequest {
  status: HealthStatus | null;
  prediction: number | null;
  lastResult: DiagnosticResultContext | null;
  isLoading: boolean;
  isDarkMode: boolean;
  apiError: string | null;
  isDisconnected: boolean;
  setValue: <K extends keyof PredictRequest>(key: K, value: PredictRequest[K]) => void;
  setDarkMode: (dark: boolean) => void;
  toggleDarkMode: () => void;
  initTheme: () => void;
  runDiagnostics: () => Promise<void>;
  clearError: () => void;
  getPayload: () => PredictRequest;
}

function applyThemeClass(dark: boolean) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', dark);
}

export const useTransformerStore = create<TransformerStore>((set, get) => ({
  ...defaults,
  status: null,
  prediction: null,
  lastResult: null,
  isLoading: false,
  isDarkMode: true,
  apiError: null,
  isDisconnected: false,

  setValue: (key, value) => set({ [key]: value }),

  setDarkMode: (dark) => {
    applyThemeClass(dark);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('tdhm-theme', dark ? 'dark' : 'light');
    }
    set({ isDarkMode: dark });
  },

  toggleDarkMode: () => {
    const next = !get().isDarkMode;
    get().setDarkMode(next);
  },

  initTheme: () => {
    const stored =
      typeof localStorage !== 'undefined' ? localStorage.getItem('tdhm-theme') : null;
    const dark = stored ? stored === 'dark' : true;
    applyThemeClass(dark);
    set({ isDarkMode: dark });
  },

  getPayload: () => {
    const s = get();
    return {
      BDV: s.BDV,
      Tan_Delta: s.Tan_Delta,
      Insulation_Resistance: s.Insulation_Resistance*1000000, // Convert MΩ to Ω for API
      Capacitance_Variation: s.Capacitance_Variation,
      Polarization_Index: s.Polarization_Index,
      DDF: s.DDF,
    };
  },

  clearError: () => set({ apiError: null }),

  runDiagnostics: async () => {
    set({ isLoading: true, apiError: null });
    try {
      const result = await predict(get().getPayload());
      const inputs = result.inputs ?? get().getPayload();
      set({
        prediction: result.prediction,
        status: result.status,
        lastResult: {
          status: result.status,
          inputs,
          prediction: result.prediction,
        },
        isDisconnected: false,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        apiError: getApiErrorMessage(error),
        isDisconnected: true,
        status: null,
        prediction: null,
        lastResult: null,
      });
    }
  },
}));
