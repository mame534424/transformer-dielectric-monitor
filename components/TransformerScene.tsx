'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { useTransformerStore } from '@/hooks/useTransformerStore';
import type { TransformerVisualState } from './TransformerModel';

const TransformerCanvasContent = dynamic(() => import('./TransformerCanvasContent'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[320px] items-center justify-center font-[family-name:var(--font-space-mono)] text-sm text-[var(--accent-cyan)]">
      Initializing 3D core…
    </div>
  ),
});

export default function TransformerScene() {
  const BDV = useTransformerStore((s) => s.BDV);
  const Tan_Delta = useTransformerStore((s) => s.Tan_Delta);
  const Insulation_Resistance = useTransformerStore((s) => s.Insulation_Resistance);
  const Capacitance_Variation = useTransformerStore((s) => s.Capacitance_Variation);
  const Polarization_Index = useTransformerStore((s) => s.Polarization_Index);
  const DDF = useTransformerStore((s) => s.DDF);
  const status = useTransformerStore((s) => s.status);
  const isLoading = useTransformerStore((s) => s.isLoading);
  const isDarkMode = useTransformerStore((s) => s.isDarkMode);

  const visualState: TransformerVisualState = useMemo(
    () => ({
      BDV,
      Tan_Delta,
      Insulation_Resistance,
      Capacitance_Variation,
      Polarization_Index,
      DDF,
      status,
      isLoading,
    }),
    [
      BDV,
      Tan_Delta,
      Insulation_Resistance,
      Capacitance_Variation,
      Polarization_Index,
      DDF,
      status,
      isLoading,
    ]
  );

  return (
    <div className="relative h-[320px] w-full flex-1 overflow-hidden rounded-xl border border-white/10 md:h-full md:min-h-[400px]">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-between px-4 py-2 text-[10px] uppercase tracking-widest text-white/40">
        <span>3D dielectric field model</span>
        <span className="text-[var(--accent-cyan)]">Orbit · Zoom</span>
      </div>
      <TransformerCanvasContent visualState={visualState} isDarkMode={isDarkMode} />
    </div>
  );
}
