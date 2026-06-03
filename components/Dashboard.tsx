'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTransformerStore } from '@/hooks/useTransformerStore';
import ThemeToggle from './ThemeToggle';
import InputPanel from './InputPanel';
import DiagnosticsPanel from './DiagnosticsPanel';
import TransformerScene from './TransformerScene';

export default function Dashboard() {
  const initTheme = useTransformerStore((s) => s.initTheme);
  const isDisconnected = useTransformerStore((s) => s.isDisconnected);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <div className="relative min-h-screen hud-grid">
      <ThemeToggle />

      <div className="mx-auto max-w-[1600px] px-4 pb-8 pt-16 md:px-8">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 border-b border-white/10 pb-6"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--accent-green)]">
            Power Station Control · AI Subsystem
          </p>
          <h1 className="font-[family-name:var(--font-syne)] text-3xl font-extrabold uppercase tracking-tight text-[var(--text-main)] md:text-5xl">
            Transformer Dielectric Health Monitor
          </h1>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-4 text-sm text-white/50">
            <span className="flex items-center gap-2">
              <span
                className={`status-dot h-2 w-2 rounded-full ${isDisconnected ? 'bg-amber-400' : 'bg-[var(--accent-green)]'}`}
              />
              {isDisconnected ? 'Backend disconnected' : 'System online'}
            </span>
            <span className="font-[family-name:var(--font-space-mono)] text-xs text-[var(--accent-cyan)]">
              TDHM v1.0
            </span>
            <Link
              href="/chat"
              className="rounded-lg border border-[var(--accent-cyan)]/30 px-3 py-1 text-xl font-semibold uppercase tracking-wider text-[var(--accent-cyan)] transition hover:border-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)]/10"
            >
              AI Chat →
          </Link>
            
          </div>
          
        </motion.header>

        <div className="flex flex-col gap-6 lg:flex-row">
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="corner-brackets w-full rounded-2xl border border-white/10 bg-[var(--bg-panel)]/90 p-6 panel-glow lg:w-[40%]"
          >
            <InputPanel />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex w-full flex-col gap-4 lg:w-[60%]"
          >
            <div className="corner-brackets min-h-[360px] flex-1 rounded-2xl border border-white/10 bg-[var(--bg-panel)]/90 p-4 panel-glow lg:min-h-[480px]">
              <TransformerScene />
            </div>
            <div className="corner-brackets rounded-2xl border border-white/10 bg-[var(--bg-panel)]/90 p-6 panel-glow">
              <DiagnosticsPanel />
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
