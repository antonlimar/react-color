import type { CSSProperties } from 'react';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const getSlotStyleOverride = (
  style: unknown,
  slot: string,
  knownSlots: readonly string[],
  rootSlot: string,
): CSSProperties | undefined => {
  if (!isRecord(style)) {
    return undefined;
  }

  if (knownSlots.some((knownSlot) => knownSlot in style)) {
    const slotStyle = style[slot];
    return isRecord(slotStyle) ? (slotStyle as CSSProperties) : undefined;
  }

  return slot === rootSlot ? (style as CSSProperties) : undefined;
};
