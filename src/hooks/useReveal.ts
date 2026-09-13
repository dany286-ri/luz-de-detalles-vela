import { useEffect, useRef, useState } from "react";

/**
 * Hook liviano para animaciones de aparición al hacer scroll (sin librerías externas).
 * Devuelve un ref para colocar en el elemento y un booleano que indica si ya es visible.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.05) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    // Un elemento ya visible al montar (por ejemplo tras recargar con scroll) se marca de inmediato.
    const initialRect = el.getBoundingClientRect();
    if (initialRect.top < window.innerHeight && initialRect.bottom > 0) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -5% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}
