import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "hadi-namaza-dark-mode";

function getInitialDark(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark") return true;
    if (stored === "light") return false;
    // Fall back to OS preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

function applyDark(isDark: boolean) {
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const initial = getInitialDark();
    // Apply immediately during init to avoid flash
    applyDark(initial);
    return initial;
  });

  // Ensure the class is applied on first render
  useEffect(() => {
    applyDark(isDark);
  }, [isDark]);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      applyDark(next);
      try {
        localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return { isDark, toggle };
}
