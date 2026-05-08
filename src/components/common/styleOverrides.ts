import type { PickerStyle } from '@/types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const getSlotStyleOverride = (
  style: unknown,
  slot: string,
  knownSlots: readonly string[],
  rootSlot: string,
): PickerStyle | undefined => {
  if (!isRecord(style)) {
    return undefined;
  }

  if (knownSlots.some((knownSlot) => knownSlot in style)) {
    const slotStyle = style[slot];
    return isRecord(slotStyle) ? (slotStyle as PickerStyle) : undefined;
  }

  return slot === rootSlot ? (style as PickerStyle) : undefined;
};

export const getDeprecatedStyleOverride = (
  styles: unknown,
  slot: string,
  knownSlots: readonly string[],
  rootSlot: string,
): PickerStyle | undefined => {
  if (!isRecord(styles)) {
    return undefined;
  }

  const defaultStyles = styles.default;

  return (
    getSlotStyleOverride(defaultStyles, slot, knownSlots, rootSlot) ??
    getSlotStyleOverride(styles, slot, knownSlots, rootSlot)
  );
};
