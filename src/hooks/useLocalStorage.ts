import { useEffect, useState } from "react";

export function useLocalStorageBoolean(key: string, defaultValue: boolean) {
  const [value, setValue] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return defaultValue;
      return raw === "true";
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, String(value));
    } catch {
      // ignore
    }
  }, [key, value]);

  return [value, setValue] as const;
}
