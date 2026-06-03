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
  const sendMessage = useChatStore((s) => s.sendMessage);
  const clearMessages = useChatStore((s) => s.clearMessages);

  const scrollRef = useRef<HTMLDivElement>(null);
  const suggestions = mode === 'result' ? RESULT_SUGGESTIONS : GENERAL_SUGGESTIONS;
  const resultModeReady = mode === 'result' && resultContext !== null;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex h-full min-h-[520px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[var(--bg-panel)]/90 panel-glow">
      <div className="border-b border-white/10 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent-cyan)]">
              AI assistant
            </p>
            <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold uppercase text-[var(--text-main)]">
              Transformer Chat
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode('general')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
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
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition disabled:cursor-not-allowed disabled:opacity-40 ${
                mode === 'result'
                  ? 'border border-[var(--accent-green)] bg-[var(--accent-green)]/15 text-[var(--accent-green)]'
                  : 'border border-white/10 text-[var(--text-main)]/60 hover:border-white/20'
              }`}
            >
              Result Analysis
            </button>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearMessages}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs uppercase tracking-wider text-[var(--text-main)]/50 hover:border-white/20"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {mode === 'result' && resultContext && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3 dark:bg-white/5"
          >
            <p className="text-xs uppercase tracking-[0.15em] text-[var(--text-main)]/50">
              Diagnostic context loaded
            </p>
            <p
              className="mt-1 font-[family-name:var(--font-syne)] text-lg font-bold uppercase"
              style={{ color: STATUS_COLORS[resultContext.status] }}
            >
              {resultContext.status}
            </p>
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs md:grid-cols-3">
              {Object.entries(resultContext.inputs).map(([key, val]) => (
                <span key={key} className="font-[family-name:var(--font-space-mono)] text-[var(--text-main)]/70">
                  {key}: {typeof val === 'number' ? val.toFixed(2) : val}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {mode === 'result' && !resultContext && (
          <p className="mt-3 text-sm text-amber-400/90">
            Run diagnostics first, then use &quot;Ask AI About This Result&quot; to load your latest
            prediction context.
          </p>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && !isLoading && (
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center text-center">
            <p className="font-[family-name:var(--font-syne)] text-lg uppercase text-[var(--text-main)]/40">
              {mode === 'result' ? 'Ask about your diagnostic result' : 'Start a conversation'}
            </p>
            <p className="mt-2 max-w-md text-sm text-[var(--text-main)]/40">
              {mode === 'result'
                ? 'Questions will include your latest status and measurement inputs.'
                : 'Ask general transformer insulation and dielectric health questions.'}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  disabled={mode === 'result' && !resultModeReady}
                  onClick={() => void sendMessage(suggestion)}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-[var(--text-main)]/70 transition hover:border-[var(--accent-cyan)]/40 hover:text-[var(--accent-cyan)] disabled:cursor-not-allowed disabled:opacity-40"
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
            <div className="rounded-2xl rounded-bl-md border border-white/10 bg-[var(--bg-panel)]/90 px-4 py-3 panel-glow">
              <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[var(--text-main)]/40">
                TDHM AI
              </p>
              <div className="flex items-center gap-1.5">
                <span className="status-dot h-2 w-2 rounded-full bg-[var(--accent-cyan)]" />
                <span className="status-dot h-2 w-2 rounded-full bg-[var(--accent-cyan)] [animation-delay:0.2s]" />
                <span className="status-dot h-2 w-2 rounded-full bg-[var(--accent-cyan)] [animation-delay:0.4s]" />
                <span className="ml-2 text-xs text-[var(--text-main)]/50">Analyzing…</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {error && (
        <div className="mx-4 mb-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <ChatInput
        onSend={(question) => void sendMessage(question)}
        isLoading={isLoading}
        disabled={mode === 'result' && !resultModeReady}
        placeholder={
          mode === 'result'
            ? 'Ask about your diagnostic result…'
            : 'Ask a transformer-related question…'
        }
      />
    </div>
  );
}
