'use client';

import { motion } from 'framer-motion';
import { confidenceFromPrediction } from '@/types';

interface ConfidenceRingProps {
  prediction: number;
}

export default function ConfidenceRing({ prediction }: ConfidenceRingProps) {
  const confidence = confidenceFromPrediction(prediction);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (confidence / 100) * circumference;
  const stroke = confidence > 70 ? '#00ff88' : confidence > 40 ? '#ffaa00' : '#ff4444';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="corner-brackets flex flex-col items-center rounded-xl border border-white/10 bg-[var(--bg-panel)]/80 p-5 panel-glow"
    >
      <span className="mb-3 text-xs uppercase tracking-[0.15em] text-white/50">
        Model confidence
      </span>
      <div className="relative">
        <svg width="128" height="128" className="-rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="10"
          />
          <motion.circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${stroke})` }}
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-space-mono)] text-2xl font-bold"
          style={{ color: stroke }}
        >
          {confidence}%
        </span>
      </div>
    </motion.div>
  );
}
