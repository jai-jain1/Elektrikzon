"use client";

import { create } from "zustand";

/** Transient UI state shared across components (not persisted). */
interface UIState {
  quoteOpen: boolean;
  setQuoteOpen: (open: boolean) => void;
  /** True while the bottom request-quote bar is showing (the floating button moves up). */
  barVisible: boolean;
  setBarVisible: (v: boolean) => void;
  toast: { id: number; text: string } | null;
  showToast: (text: string) => void;
}

export const useUI = create<UIState>()((set) => ({
  quoteOpen: false,
  setQuoteOpen: (quoteOpen) => set({ quoteOpen }),
  barVisible: false,
  setBarVisible: (barVisible) => set({ barVisible }),
  toast: null,
  showToast: (text) => set({ toast: { id: Date.now(), text } }),
}));
