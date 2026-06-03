'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useChatStore } from '@/hooks/useChatStore';
import { STATUS_COLORS } from '@/types';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const GENERAL_SUGGESTIONS = [
  'What is PDC?',
  'What causes insulation degradation?',
  'How does moisture affect transformer insulation?',
];

const RESULT_SUGGESTIONS = [
  'Why is my transformer critical?',
  'What should I improve first?',
  'Which parameter is most concerning?',
];

export default function ChatWindow() {
  const messages = useChatStore((s) => s.messages);
  const mode = useChatStore((s) => s.mode);
  const resultContext = useChatStore((s) => s.resultContext);
  const isLoading = useChatStore((s) => s.isLoading);
  const error = useChatStore((s) => s.error);
  const setMode = useChatStore((s) => s.setMode);
  const clearMessages = useChatStore((s) => s.clearMessages);
  const sendMessage = useChatStore((s) => s.sendMessage);

  const scrollRef = useRef<HTMLDivElement>(null);
  const suggestions = mode === 'result' ? RESULT_SUGGESTIONS : GENERAL_SUGGESTIONS;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex h-full min-h-[520px] flex-col">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode('general')}
            className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
              mode === 'general'
                ? 'border border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/15 text-[var(--accent-cyan)]'
                : 'border border-white/10 text-[var(--text-main)]/60 hover:border-white/20'
            }`}
          >
            General Chat
          </button>
          <button
            type="button"
            onClick={() => setMode('result')}
            disabled={!resultContext}
            className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition disabled:cursor-not-allowed disabled:opacity-40 ${
              mode === 'result'
                ? 'border border-[var(--accent-green)] bg-[var(--accent-green)]/15 text-[var(--accent-green)]'
                : 'border border-white/10 text-[var(--text-main)]/60 hover:border-white/20'
            }`}
          >
            Result Analysis Chat
          </button>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={clearMessages}
            className="text-xs uppercase tracking-wider text-[var(--text-main)]/40 hover:text-[var(--accent-cyan)]"
          >
            Clear history
          </button>
        )}
      </div>

      {mode === 'result' && resultContext && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-xl border border-white/10 bg-black/20 p-4 dark:bg-white/5"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-main)]/50">
            Diagnostic context loaded
          </p>
          <p
            className="mt-1 font-[family-name:var(--font-syne)] text-lg font-bold uppercase"
            style={{ color: STATUS_COLORS[resultContext.status] }}
          >
            {resultContext.status}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs md:grid-cols-3">
            {Object.entries(resultContext.inputs).map(([key, value]) => (
              <div key={key} className="rounded-lg bg-black/20 px-2 py-1.5 dark:bg-white/5">
                <span className="text-[var(--text-main)]/40">{key.replace(/_/g, ' ')}</span>
                <p className="font-[family-name:var(--font-space-mono)] font-bold text-[var(--accent-cyan)]">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {mode === 'result' && !resultContext && (
        <div className="mb-4 rounded-xl border border-dashed border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200/90">
          Run diagnostics first, then use &quot;Ask AI About This Result&quot; to enable result analysis chat.
        </div>
      )}

      <div
        ref={scrollRef}
        className="mb-4 flex-1 space-y-4 overflow-y-auto rounded-xl border border-white/10 bg-[var(--bg-panel)]/50 p-4 panel-glow"
      >
        {messages.length === 0 && !isLoading && (
          <div className="flex h-full min-h-[240px] flex-col items-center justify-center text-center">
            <p className="font-[family-name:var(--font-syne)] text-lg uppercase text-[var(--text-main)]/40">
              {mode === 'result' ? 'Ask about your diagnostic result' : 'Transformer AI Assistant'}
            </p>
            <p className="mt-2 max-w-md text-sm text-[var(--text-main)]/30">
              {mode === 'result'
                ? 'Questions will include your latest status and measurement inputs.'
                : 'Ask general questions about transformer health, insulation, and diagnostics.'}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => void sendMessage(suggestion)}
                  disabled={isLoading || (mode === 'result' && !resultContext)}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-[var(--text-main)]/70 transition hover:border-[var(--accent-cyan)]/40 hover:text-[var(--accent-cyan)] disabled:opacity-40"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="rounded-2xl rounded-bl-md border border-white/10 bg-black/20 px-4 py-3 dark:bg-white/5">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-main)]/40">AI Assistant</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="status-dot h-2 w-2 rounded-full bg-[var(--accent-cyan)]" />
                <span className="status-dot h-2 w-2 rounded-full bg-[var(--accent-cyan)]" />
                <span className="status-dot h-2 w-2 rounded-full bg-[var(--accent-cyan)]" />
                <span className="text-sm text-[var(--text-main)]/50">Analyzing…</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {error && (
        <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <ChatInput
        onSend={(question) => void sendMessage(question)}
        disabled={isLoading || (mode === 'result' && !resultContext)}
        placeholder={
          mode === 'result'
            ? 'Ask about your diagnostic result…'
            : 'What is PDC? How does moisture affect insulation?'
        }
      />
    </div>
  );
}
