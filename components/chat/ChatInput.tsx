'use client';

import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Ask a transformer-related question…',
}: ChatInputProps) {
  const [value, setValue] = useState('');

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 border-t border-white/10 pt-4">
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={3}
        placeholder={placeholder}
        className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[var(--text-main)] outline-none transition focus:border-[var(--accent-cyan)]/50 focus:ring-1 focus:ring-[var(--accent-cyan)]/30 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white/5 md:text-base"
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-[var(--text-main)]/40">Enter to send · Shift+Enter for new line</p>
        <motion.button
          type="submit"
          disabled={disabled || !value.trim()}
          whileHover={{ scale: disabled ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-xl border border-[var(--accent-cyan)] bg-gradient-to-r from-[var(--accent-cyan)]/20 to-[var(--accent-green)]/20 px-5 py-2.5 font-[family-name:var(--font-syne)] text-sm font-bold uppercase tracking-[0.15em] text-[var(--accent-cyan)] panel-glow disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send
        </motion.button>
      </div>
    </form>
  );
}
