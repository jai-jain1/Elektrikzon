import { createJSONStorage, type StateStorage } from "zustand/middleware";

/** localStorage key for language, theme and Lite mode (read by the theme script too). */
export const PREFS_KEY = "ez-prefs";

// localStorage can throw (private windows, blocked site data). Every read
// and write is wrapped so the site works the same with or without it.
const safeLocalStorage: StateStorage = {
  getItem: (key) => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* storage unavailable: keep state in memory only */
    }
  },
  removeItem: (key) => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};

export const safeJSONStorage = createJSONStorage(() => safeLocalStorage);
