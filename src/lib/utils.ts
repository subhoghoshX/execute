import { clsx, type ClassValue } from "clsx";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      return true;
    } else if (theme === "light") {
      return false;
    } else {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return isDark;
    }
  });

  useEffect(() => {
    function setDarkMode() {
      const theme = localStorage.getItem("theme");
      if (theme === "dark") {
        setIsDark(true);
      } else if (theme === "light") {
        setIsDark(false);
      } else {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDark(isDark);
      }
    }

    window.addEventListener("storage", setDarkMode);
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", setDarkMode);

    return () => {
      window.removeEventListener("storage", setDarkMode);
      window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", setDarkMode);
    };
  }, []);

  return [isDark, setIsDark] as const;
}
