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
