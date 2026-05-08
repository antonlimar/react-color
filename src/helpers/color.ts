import each from 'lodash/each';
import tinycolor from 'tinycolor2';

import type { Color, ColorChangeValue, ColorResult } from '@/types';
import type { BasicColorState, ColorDataKey, ColorDataRecord, ValidColorStringType } from './types';

const keysToCheck: ColorDataKey[] = ['r', 'g', 'b', 'a', 'h', 's', 'l', 'v'];

export const simpleCheckForValidColor = <T>(data: T): T | false => {
  let checked = 0;
  let passed = 0;

  each(keysToCheck, (letter) => {
    const value = (data as ColorDataRecord)[letter];

    if (value) {
      checked += 1;

      if (!isNaN(value as number)) {
        passed += 1;
      }

      if (letter === 's' || letter === 'l') {
        const percentPatt = /^\d+%$/;
        if (typeof value === 'string' && percentPatt.test(value)) {
          passed += 1;
        }
      }
    }
  });

  return checked === passed ? data : false;
};

export const toState = (data: Color | ColorChangeValue, oldHue = 0): ColorResult => {
  const colorData = data as ColorChangeValue;
  const color = colorData.hex ? tinycolor(colorData.hex) : tinycolor(data);
  const hsl = color.toHsl();
  const hsv = color.toHsv();
  const rgb = color.toRgb();
  const hex = color.toHex();

  if (hsl.s === 0) {
    hsl.h = oldHue || 0;
    hsv.h = oldHue || 0;
  }

  const transparent = hex === '000000' && rgb.a === 0;

  return {
    hsl,
    hex: transparent ? 'transparent' : `#${hex}`,
    rgb,
    hsv,
    oldHue: colorData.h || oldHue || hsl.h,
    source: colorData.source,
  };
};

export const isValidHex = (hex: unknown): boolean => {
  if (hex === 'transparent') {
    return true;
  }

  const hexString = String(hex);

  // disable hex4 and hex8
  const lh = hexString.charAt(0) === '#' ? 1 : 0;
  return hexString.length !== 4 + lh && hexString.length < 7 + lh && tinycolor(hexString).isValid();
};

export const getContrastingColor = (data?: Color | ColorChangeValue): string => {
  if (!data) {
    return '#fff';
  }

  const col = toState(data);

  if (col.hex === 'transparent') {
    return 'rgba(0,0,0,0.4)';
  }

  const yiq = (col.rgb.r * 299 + col.rgb.g * 587 + col.rgb.b * 114) / 1000;
  return yiq >= 128 ? '#000' : '#fff';
};

export const red: BasicColorState = {
  hsl: { a: 1, h: 0, l: 0.5, s: 1 },
  hex: '#ff0000',
  rgb: { r: 255, g: 0, b: 0, a: 1 },
  hsv: { h: 0, s: 1, v: 1, a: 1 },
};

export const isvalidColorString = (string: string, type: ValidColorStringType): boolean => {
  const stringWithoutDegree = string.replace('°', '');
  return tinycolor(`${type} (${stringWithoutDegree})`).isValid();
};
