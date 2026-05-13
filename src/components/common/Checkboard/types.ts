import type { ReactNode } from 'react';
import type { Radius } from '@/types';

export interface CheckboardRenderers {
  canvas?: new () => {
    width: number;
    height: number;
    getContext(contextId: '2d'): {
      fillStyle: string;
      fillRect(x: number, y: number, width: number, height: number): void;
      translate(x: number, y: number): void;
    } | null;
    toDataURL(): string;
  };
  [key: string]: unknown;
}

export interface CheckboardProps {
  white?: string;
  grey?: string;
  size?: number;
  renderers?: CheckboardRenderers;
  borderRadius?: Radius;
  boxShadow?: string;
  children?: ReactNode;
}
