'use client';

import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTransformerStore } from '@/hooks/useTransformerStore';
import { useChatStore } from '@/hooks/useChatStore';
import ThemeToggle from '@/components/ThemeToggle';
import ChatWindow from '@/components/ChatWindow';

function ChatPageContent() {
  const searchParams = useSearchParams();
  const initTheme = useTransformerStore((s) => s.initTheme);
  const lastResult = useTransformerStore((s) => s.lastResult);
  const openWithResult = useChatStore((s) => s.openWithResult);
  const setMode = useChatStore((s) => s.setMode);
  const resultContext = useChatStore((s) => s.resultContext);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'result' && lastResult && !resultContext) {
      openWithResult(lastResult);
    } else if (mode === 'general') {
      setMode('general');
    }
  }, [searchParams, lastResult, resultContext, openWithResult, setMode]);

  return (
    <div className="relative min-h-screen hud-grid">
      <ThemeToggle />

      <div className="mx-auto max-w-5xl px-4 pb-8 pt-16 md:px-8">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--accent-green)]">
              Power Station Control · AI Subsystem
            </p>
            <h1 className="font-[family-name:var(--font-syne)] text-3xl font-extrabold uppercase tracking-tight text-[var(--text-main)] md:text-4xl">
              Transformer AI Chat
            </h1>
          </div>
          <Link
            href="/"
            className="rounded-lg border border-[var(--accent-cyan)]/40 bg-[var(--bg-panel)] px-4 py-2 text-sm font-semibold uppercase tracking-wider text-[var(--accent-cyan)] panel-glow transition hover:border-[var(--accent-cyan)]"
          >
            ← Diagnostics
          </Link>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="corner-brackets h-[calc(100vh-220px)] min-h-[560px]"
        >
          <ChatWindow />
        </motion.div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-[var(--accent-cyan)]">
          Loading chat…
        </div>
      }
    >
      <ChatPageContent />
    </Suspense>
  );
}
