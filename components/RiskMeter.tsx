'use client';

import { motion } from 'framer-motion';
import { predictionToPercent, riskColor } from '@/types';

interface RiskMeterProps {
  prediction: number;
}

export default function RiskMeter({ prediction }: RiskMeterProps) {
  const percent = predictionToPercent(prediction);
  const fillColor = riskColor(percent);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="corner-brackets rounded-xl border border-white/10 bg-[var(--bg-panel)]/80 p-5 panel-glow"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.15em] text-white/50">Risk index</span>
        <span
          className="font-[family-name:var(--font-space-mono)] text-sm font-bold"
          style={{ color: fillColor }}
        >
          {percent}%
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: fillColor, boxShadow: `0 0 16px ${fillColor}` }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[10px] uppercase text-white/30">
        <span>Low</span>
        <span>Critical</span>
      </div>
    </motion.div>
  );
}
