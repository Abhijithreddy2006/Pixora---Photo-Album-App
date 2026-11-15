import { useEffect, useState } from 'react';

/** Column count for a container width — two on phones, up to six on wide screens. */
export function columnsForWidth(width) {
  if (width < 520) return 2;
  if (width < 860) return 3;
  if (width < 1180) return 4;
  if (width < 1500) return 5;
  return 6;
}

/** Tracks the width of `ref`'s element and returns how many masonry columns fit. */
export function useColumnCount(ref) {
  const [count, setCount] = useState(() =>
    columnsForWidth(typeof window === 'undefined' ? 1200 : window.innerWidth),
  );

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const update = (width) => setCount(columnsForWidth(width));
    update(node.getBoundingClientRect().width);

    if (typeof ResizeObserver === 'undefined') {
      const onResize = () => update(node.getBoundingClientRect().width);
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }
    const observer = new ResizeObserver((entries) => update(entries[0].contentRect.width));
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return count;
}
