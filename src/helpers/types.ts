import type { ColorResult } from '@/types';

export type SliderDirection = 'horizontal' | 'vertical';

export interface SliderContainerBounds {
  left: number;
  top: number;
}

export interface SliderChangeContainer {
  clientWidth: number;
  clientHeight: number;
  getBoundingClientRect(): SliderContainerBounds;
}

export interface SaturationContainerRect {
  width: number;
  height: number;
  left: number;
  top: number;
}

export interface SaturationChangeContainer {
  getBoundingClientRect(): SaturationContainerRect;
}

export interface PageCoordinates {
  pageX: number;
  pageY: number;
}

export interface MouseLikeEvent {
  pageX: number;
  pageY: number;
}

export interface TouchListLike {
  0: PageCoordinates;
  length: number;
}

export interface TouchLikeEvent {
  touches: TouchListLike;
}

export interface CanvasRenderingContext2DLike {
  fillStyle: string;
  fillRect(x: number, y: number, width: number, height: number): void;
  translate(x: number, y: number): void;
}

export interface CanvasLike {
  width: number;
  height: number;
  getContext(contextId: '2d'): CanvasRenderingContext2DLike | null;
  toDataURL(): string;
}

export type ServerCanvas = new () => CanvasLike;

export type ColorDataKey = 'r' | 'g' | 'b' | 'a' | 'h' | 's' | 'l' | 'v';
export type ColorDataRecord = Record<string, unknown>;
export type ValidColorStringType = 'rgb' | 'hsl' | 'hsv';
export type BasicColorState = Omit<ColorResult, 'oldHue' | 'source'>;
