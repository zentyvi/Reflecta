import { useEffect } from "react";

export function useEscape(callback: () => void) {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") callback();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);
}

export const useTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} | Reflecta`;
  }, [title]);
};
