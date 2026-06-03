'use client';

import { motion } from 'framer-motion';
import type { ChatMessageItem } from '@/types';

interface ChatMessageProps {
  message: ChatMessageItem;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 md:max-w-[75%] ${
          isUser
            ? 'rounded-br-md border border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/15'
            : 'rounded-bl-md border border-white/10 bg-[var(--bg-panel)]/90 panel-glow'
        }`}
      >
        <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-[var(--text-main)]/40">
          {isUser ? 'You' : 'TDHM AI'}
        </p>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-main)]/90">
          {message.content}
        </p>
      </div>
    </motion.div>
  );
}
