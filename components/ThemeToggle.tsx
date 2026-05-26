'use client';

import { motion } from 'framer-motion';
import { useTransformerStore } from '@/hooks/useTransformerStore';

export default function ThemeToggle() {
  const isDarkMode = useTransformerStore((s) => s.isDarkMode);
  const toggleDarkMode = useTransformerStore((s) => s.toggleDarkMode);

  return (
    <motion.button
      type="button"
      onClick={toggleDarkMode}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg border border-[var(--accent-cyan)]/40 bg-[var(--bg-panel)] px-4 py-2 text-sm font-semibold uppercase tracking-wider text-[var(--text-main)] panel-glow"
      aria-label="Toggle dark mode"
    >
      <span className="text-[var(--accent-cyan)]">{isDarkMode ? '◐' : '◑'}</span>
      <span className="font-[family-name:var(--font-syne)]">{isDarkMode ? 'Dark' : 'Light'}</span>
    </motion.button>
  );
}
