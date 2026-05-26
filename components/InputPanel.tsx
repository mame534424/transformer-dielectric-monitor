'use client';

import { motion } from 'framer-motion';
import { useTransformerStore } from '@/hooks/useTransformerStore';
import { SLIDER_CONFIGS } from '@/types';
import type { PredictRequest } from '@/types';
import { getSliderAccent } from '@/lib/sliderColors';

export default function InputPanel() {
  const store = useTransformerStore();
  const isLoading = store.isLoading;
  const isDisconnected = store.isDisconnected;
  const apiError = store.apiError;

  return (
    <div className="flex h-full flex-col gap-4">
      <header className="mb-2">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent-cyan)]">
          Input telemetry
        </p>
        <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold uppercase text-[var(--text-main)] md:text-3xl">
          Dielectric Parameters
        </h1>
      </header>

      {isDisconnected && apiError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-200"
        >
          {apiError}
        </motion.div>
      )}

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto pr-1">
        {SLIDER_CONFIGS.map((config, index) => {
          const value = store[config.key] as number;
          const accent = getSliderAccent(config.key, value);

          return (
            <motion.div
              key={config.key}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-lg border border-white/5 bg-black/20 p-4 dark:bg-white/5"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <label
                  htmlFor={config.key}
                  className="text-sm font-semibold uppercase tracking-wide text-[var(--text-main)]/90"
                >
                  {config.label}
                </label>
                <motion.span
                  key={value}
                  initial={{ scale: 1.15 }}
                  animate={{ scale: 1 }}
                  className="font-[family-name:var(--font-space-mono)] text-sm font-bold tabular-nums"
                  style={{ color: accent }}
                >
                  {value.toFixed(config.step && config.step < 1 ? 2 : 0)}
                  {config.unit !== '—' ? ` ${config.unit}` : ''}
                </motion.span>
              </div>
              <input
                id={config.key}
                type="range"
                min={config.min}
                max={config.max}
                step={config.step ?? 1}
                value={value}
                onChange={(e) =>
                  store.setValue(config.key, parseFloat(e.target.value) as PredictRequest[typeof config.key])
                }
                style={{ ['--thumb-color' as string]: accent }}
                className="w-full"
              />
              <div className="mt-1 flex justify-between text-[10px] text-white/30">
                <span>{config.min}</span>
                <span>{config.max}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        type="button"
        disabled={isLoading}
        onClick={() => void store.runDiagnostics()}
        whileHover={{ scale: isLoading ? 1 : 1.02, boxShadow: '0 0 32px rgba(0,212,255,0.5)' }}
        whileTap={{ scale: 0.98 }}
        className="mt-2 w-full rounded-xl border border-[var(--accent-cyan)] bg-gradient-to-r from-[var(--accent-cyan)]/20 to-[var(--accent-green)]/20 py-4 font-[family-name:var(--font-syne)] text-lg font-bold uppercase tracking-[0.2em] text-[var(--accent-cyan)] panel-glow disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Analyzing…' : 'Run Diagnostics'}
      </motion.button>
    </div>
  );
}
