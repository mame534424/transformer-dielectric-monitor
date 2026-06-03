'use client';

import { create } from 'zustand';
import { chat, getApiErrorMessage } from '@/lib/api';
import type { ChatMessageItem, ChatMode, DiagnosticResultContext } from '@/types';

interface ChatStore {
  messages: ChatMessageItem[];
  mode: ChatMode;
  resultContext: DiagnosticResultContext | null;
  isLoading: boolean;
  error: string | null;
  setMode: (mode: ChatMode) => void;
  setResultContext: (context: DiagnosticResultContext | null) => void;
  openWithResult: (context: DiagnosticResultContext) => void;
  clearMessages: () => void;
  sendMessage: (question: string) => Promise<void>;
}

function createMessage(role: ChatMessageItem['role'], content: string): ChatMessageItem {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    timestamp: Date.now(),
  };
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  mode: 'general',
  resultContext: null,
  isLoading: false,
  error: null,

  setMode: (mode) => set({ mode, error: null }),

  setResultContext: (context) => set({ resultContext: context }),

  openWithResult: (context) => {
    set({
      mode: 'result',
      resultContext: context,
      messages: [],
      error: null,
    });
  },

  clearMessages: () => set({ messages: [], error: null }),

  sendMessage: async (question) => {
    const trimmed = question.trim();
    if (!trimmed || get().isLoading) return;

    const { mode, resultContext } = get();
    const userMessage = createMessage('user', trimmed);

    set((state) => ({
      messages: [...state.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const payload =
        mode === 'result' && resultContext
          ? {
              question: trimmed,
              status: resultContext.status,
              inputs: resultContext.inputs,
            }
          : { question: trimmed };

      const response = await chat(payload);
      const assistantMessage = createMessage('assistant', response.answer);

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: getApiErrorMessage(error),
      });
    }
  },
}));
