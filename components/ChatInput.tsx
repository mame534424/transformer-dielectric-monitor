'use client';

import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export default function ChatInput({
  onSend,
  isLoading,
  placeholder = 'Ask a transformer-related question…',
  disabled = false,
}: ChatInputProps) {
  const [value, setValue] = useState('');

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading || disabled) return;
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
    <form onSubmit={handleSubmit} className="border-t border-white/10 bg-[var(--bg-panel)]/80 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          disabled={isLoading || disabled}
          placeholder={placeholder}
          className="min-h-[52px] flex-1 resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[var(--text-main)] outline-none transition focus:border-[var(--accent-cyan)]/50 disabled:opacity-50 dark:bg-white/5"
        />
        <motion.button
          type="submit"
          disabled={isLoading || disabled || !value.trim()}
          whileHover={{ scale: isLoading || disabled ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-xl border border-[var(--accent-cyan)] bg-gradient-to-r from-[var(--accent-cyan)]/20 to-[var(--accent-green)]/20 px-6 py-3 font-[family-name:var(--font-syne)] text-sm font-bold uppercase tracking-[0.15em] text-[var(--accent-cyan)] panel-glow disabled:cursor-not-allowed disabled:opacity-50 md:min-w-[120px]"
        >
          {isLoading ? 'Sending…' : 'Send'}
        </motion.button>
      </div>
    </form>
  );
}
