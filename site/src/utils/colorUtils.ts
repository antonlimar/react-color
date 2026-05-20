import type { CSSProperties } from 'react';
import type { RGBAColor } from '@antonlimar/react-color';

export const initialColor: RGBAColor = {
  r: 65,
  g: 117,
  b: 5,
  a: 1,
};

export function formatBackground(color: RGBAColor) {
  const alpha = color.a ?? 1;
  const glowAlpha = Math.max(alpha * 0.32, 0.18);
  const pageAlpha = Math.max(alpha * 0.18, 0.12);
  const floorAlpha = Math.max(alpha * 0.42, 0.28);
  const washAlpha = Math.max(alpha * 0.12, 0.08);

  return {
    '--site-accent': `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`,
    '--site-accent-soft': `rgba(${color.r}, ${color.g}, ${color.b}, ${glowAlpha})`,
    '--site-accent-page': `rgba(${color.r}, ${color.g}, ${color.b}, ${pageAlpha})`,
    '--site-accent-floor': `rgba(${color.r}, ${color.g}, ${color.b}, ${floorAlpha})`,
    '--site-accent-wash': `rgba(${color.r}, ${color.g}, ${color.b}, ${washAlpha})`,
  } as CSSProperties;
}

export function clampColorChannel(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

export function colorToHex(color: RGBAColor) {
  const toHex = (value: number) => clampColorChannel(value).toString(16).padStart(2, '0');
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`.toUpperCase();
}

export function createPaletteStops(color: RGBAColor) {
  const alpha = color.a ?? 1;
  const offsets = [120, 48, -18, -80];

  return offsets.map((offset, index) => {
    const mix = index < 2 ? 0.28 : 0.16;
    const target = index < 2 ? 255 : 12;

    const channel = (value: number) => clampColorChannel(value + (target - value) * mix + offset * 0.08);

    return `rgba(${channel(color.r)}, ${channel(color.g)}, ${channel(color.b)}, ${Math.max(alpha * 0.92, 0.84)})`;
  });
}
