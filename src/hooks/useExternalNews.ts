import { useEffect, useState } from "react";
import { toDisplayItem, type DisplayNewsItem } from "../data/externalNews";

// Una sola consulta por carga de página, compartida entre montajes.
let request: Promise<DisplayNewsItem[]> | null = null;

function loadExternalNews(): Promise<DisplayNewsItem[]> {
  request ??= fetch("/api/news")
    .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
    .then((data: unknown): DisplayNewsItem[] => {
      const items = (data as { items?: unknown } | null)?.items;
      if (!Array.isArray(items)) return [];
      return items.flatMap((raw) => {
        const item = toDisplayItem(raw);
        return item ? [item] : [];
      });
    })
    .catch(() => {
      // Sin API (o caída): la sección sigue mostrando sólo las noticias propias.
      request = null;
      return [];
    });
  return request;
}

export function useExternalNews(): DisplayNewsItem[] {
  const [items, setItems] = useState<DisplayNewsItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    loadExternalNews().then((loaded) => {
      if (!cancelled) setItems(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return items;
}
