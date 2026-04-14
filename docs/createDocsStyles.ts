import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

export type DocsStyles = Record<string, CSSProperties>;

type DocsStyleLayers = Record<string, DocsStyles>;

function isMatchingCondition(condition: string): boolean {
  if (condition === 'default') {
    return true;
  }

  if (!condition.startsWith('@media ')) {
    return false;
  }

  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(condition.slice('@media '.length)).matches
    : false;
}

export function createDocsStyles(...layers: DocsStyleLayers[]): DocsStyles {
  return layers.reduce<DocsStyles>((styles, layer) => {
    for (const [condition, partialStyles] of Object.entries(layer)) {
      if (!isMatchingCondition(condition)) {
        continue;
      }

      for (const [slot, slotStyles] of Object.entries(partialStyles)) {
        styles[slot] = {
          ...(styles[slot] ?? {}),
          ...slotStyles,
        };
      }
    }

    return styles;
  }, {});
}

export function useDocsStyles(...layers: DocsStyleLayers[]): DocsStyles {
  const [, setViewportVersion] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    let frame = 0;

    const handleResize = () => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        setViewportVersion((version) => version + 1);
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return createDocsStyles(...layers);
}
