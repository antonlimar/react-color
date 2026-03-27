import type { CSSProperties } from 'react';
import reactCSS from 'reactcss';

export type DocsStyles = Record<string, CSSProperties>;

export function createDocsStyles(...args: Parameters<typeof reactCSS>): DocsStyles {
  return reactCSS(...args) as DocsStyles;
}
