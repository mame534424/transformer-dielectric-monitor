'use client';

import { motion } from 'framer-motion';
import type { HealthStatus } from '@/types';
import { STATUS_COLORS, predictionToPercent } from '@/types';

interface StatusCardProps {
  status: HealthStatus;
  prediction: number;
}

export default function StatusCard({ status, prediction }: StatusCardProps) {
  const color = STATUS_COLORS[status];
  const percent = predictionToPercent(prediction);

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      className="corner-brackets rounded-xl border border-white/10 bg-[var(--bg-panel)]/80 p-6 panel-glow"
    >
      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--text-main)]/50">
        <span
          className="status-dot inline-block h-2 w-2 rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
        />
        Live diagnostic status
      </div>
      <motion.h2
        className="font-[family-name:var(--font-syne)] text-3xl font-bold uppercase tracking-wide md:text-4xl"
        style={{ color, textShadow: `0 0 24px ${color}66` }}
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
      >
        {status}
      </motion.h2>
      <p className="mt-4 text-sm text-[var(--text-main)]/60">Prediction score</p>
      <p
        className="font-[family-name:var(--font-space-mono)] text-4xl font-bold"
        style={{ color }}
      >
        {percent}
        <span className="text-lg text-[var(--text-main)]/50">%</span>
      </p>
    </motion.div>
  );
}
