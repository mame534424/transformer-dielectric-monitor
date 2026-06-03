'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTransformerStore } from '@/hooks/useTransformerStore';
import { useChatStore } from '@/hooks/useChatStore';
import StatusCard from './StatusCard';
import RiskMeter from './RiskMeter';
import ConfidenceRing from './ConfidenceRing';

export default function DiagnosticsPanel() {
  const status = useTransformerStore((s) => s.status);
  const prediction = useTransformerStore((s) => s.prediction);
  const lastResult = useTransformerStore((s) => s.lastResult);
  const isLoading = useTransformerStore((s) => s.isLoading);
  const isDisconnected = useTransformerStore((s) => s.isDisconnected);
  const openWithResult = useChatStore((s) => s.openWithResult);

  return (
    <div className="flex h-full flex-col gap-4">
      <header>
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent-cyan)]">
          AI diagnostics
        </p>
        <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold uppercase text-[var(--text-main)] md:text-2xl">
          Insulation Health Output
        </h2>
      </header>

      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg border border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/10 px-4 py-3 text-sm text-[var(--accent-cyan)]"
        >
          Running neural inference on dielectric signature…
        </motion.div>
      )}

      {!isLoading && !status && (
        <div className="corner-brackets flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-[var(--bg-panel)]/50 p-8 text-center panel-glow">
          <p className="font-[family-name:var(--font-syne)] text-lg uppercase text-white/40">
            Awaiting diagnostics
          </p>
          <p className="mt-2 max-w-xs text-sm text-white/30">
            Adjust telemetry sliders and run diagnostics to evaluate transformer insulation health.
          </p>
          {isDisconnected && (
            <p className="mt-4 text-xs text-amber-400/80">
              Backend offline — connect FastAPI at {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}
            </p>
          )}
        </div>
      )}

      {status !== null && prediction !== null && (
        <div className="grid flex-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <StatusCard status={status} prediction={prediction} />
          </div>
          <RiskMeter prediction={prediction} />
          <ConfidenceRing prediction={prediction} />
          {lastResult && (
            <div className="md:col-span-2">
              <Link
                href="/chat?mode=result"
                onClick={() => openWithResult(lastResult)}
                className="block w-full rounded-xl border border-[var(--accent-green)] bg-gradient-to-r from-[var(--accent-green)]/15 to-[var(--accent-cyan)]/15 py-3 text-center font-[family-name:var(--font-syne)] text-sm font-bold uppercase tracking-[0.15em] text-[var(--accent-green)] panel-glow transition hover:scale-[1.01]"
              >
                Ask AI About This Result
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
