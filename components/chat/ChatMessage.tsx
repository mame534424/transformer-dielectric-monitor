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
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 md:max-w-[75%] ${
          isUser
            ? 'rounded-br-md border border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/15 text-[var(--text-main)]'
            : 'rounded-bl-md border border-white/10 bg-black/20 text-[var(--text-main)] dark:bg-white/5'
        }`}
      >
        <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-[var(--text-main)]/40">
          {isUser ? 'You' : 'AI Assistant'}
        </p>
        <p className="whitespace-pre-wrap text-sm leading-relaxed md:text-base">{message.content}</p>
      </div>
    </motion.div>
  );
}
