import { getContrastingColor, isValidHex, isvalidColorString, simpleCheckForValidColor, toState } from './color';

describe('helpers/color', () => {
  describe('simpleCheckForValidColor', () => {
    test('throws on null', () => {
      const data = null;
      expect(() => simpleCheckForValidColor(data)).toThrowError(TypeError);
    });

    test('throws on undefined', () => {
      const data = undefined;
      expect(() => simpleCheckForValidColor(data)).toThrowError(TypeError);
    });

    test('no-op on number', () => {
      const data = 255;
      expect(simpleCheckForValidColor(data)).toEqual(data);
    });

    test('no-op on NaN', () => {
      const data = NaN;
      const result = simpleCheckForValidColor(data);
      expect(typeof result === 'number' && isNaN(result)).toBeTruthy();
    });

    test('no-op on string', () => {
      const data = 'ffffff';
      expect(simpleCheckForValidColor(data)).toEqual(data);
    });

    test('no-op on array', () => {
      const data: unknown[] = [];
      expect(simpleCheckForValidColor(data)).toEqual(data);
    });

    test('no-op on rgb objects with numeric keys', () => {
      const data = { r: 0, g: 0, b: 0 };
      expect(simpleCheckForValidColor(data)).toEqual(data);
    });

    test('no-op on an object with an r g b a h s v key mapped to a NaN value', () => {
      const data = { r: NaN };
      expect(simpleCheckForValidColor(data)).toEqual(data);
    });

    test('no-op on hsl "s" percentage', () => {
      const data = { s: '15%' };
      expect(simpleCheckForValidColor(data)).toEqual(data);
    });

    test('no-op on hsl "l" percentage', () => {
      const data = { l: '100%' };
      expect(simpleCheckForValidColor(data)).toEqual(data);
    });

    test('should return false for invalid percentage', () => {
      const data = { l: '100%2' };
      expect(simpleCheckForValidColor(data)).toBe(false);
    });
  });

  describe('toState', () => {
    test('returns an object giving a color in all formats', () => {
      expect(toState('red')).toEqual({
        hsl: { a: 1, h: 0, l: 0.5, s: 1 },
        hex: '#ff0000',
        rgb: { r: 255, g: 0, b: 0, a: 1 },
        hsv: { h: 0, s: 1, v: 1, a: 1 },
        oldHue: 0,
        source: undefined,
      });
    });

    test('gives hex color with leading hash', () => {
      expect(toState('blue').hex).toEqual('#0000ff');
    });

    test("doesn't mutate hsl color object", () => {
      const originalData = { h: 0, s: 0, l: 0, a: 1 };
      const data = Object.assign({}, originalData);
      toState(data);
      expect(data).toEqual(originalData);
    });

    test("doesn't mutate hsv color object", () => {
      const originalData = { h: 0, s: 0, v: 0, a: 1 };
      const data = Object.assign({}, originalData);
      toState(data);
      expect(data).toEqual(originalData);
    });
  });

  describe('isValidHex', () => {
    test('allows strings of length 3 or 6', () => {
      expect(isValidHex('f')).toBeFalsy();
      expect(isValidHex('ff')).toBeFalsy();
      expect(isValidHex('fff')).toBeTruthy();
      expect(isValidHex('ffff')).toBeFalsy();
      expect(isValidHex('fffff')).toBeFalsy();
      expect(isValidHex('ffffff')).toBeTruthy();
      expect(isValidHex('fffffff')).toBeFalsy();
      expect(isValidHex('ffffffff')).toBeFalsy();
      expect(isValidHex('fffffffff')).toBeFalsy();
      expect(isValidHex('ffffffffff')).toBeFalsy();
      expect(isValidHex('fffffffffff')).toBeFalsy();
      expect(isValidHex('ffffffffffff')).toBeFalsy();
    });

    test('allows strings without leading hash', () => {
      // Check a sample of possible colors - doing all takes too long.
      for (let i = 0; i <= 0xffffff; i += 0x010101) {
        const hex = `000000${i.toString(16)}`.slice(-6);
        expect(isValidHex(hex)).toBeTruthy();
      }
    });

    test('allows strings with leading hash', () => {
      // Check a sample of possible colors - doing all takes too long.
      for (let i = 0; i <= 0xffffff; i += 0x010101) {
        const hex = `000000${i.toString(16)}`.slice(-6);
        expect(isValidHex(`#${hex}`)).toBeTruthy();
      }
    });

    test('is case-insensitive', () => {
      expect(isValidHex('ffffff')).toBeTruthy();
      expect(isValidHex('FfFffF')).toBeTruthy();
      expect(isValidHex('FFFFFF')).toBeTruthy();
    });

    test('allow transparent color', () => {
      expect(isValidHex('transparent')).toBeTruthy();
    });

    test('does not allow non-hex characters', () => {
      expect(isValidHex('gggggg')).toBeFalsy();
    });

    test('does not allow numbers', () => {
      expect(isValidHex(0xffffff)).toBeFalsy();
    });
  });

  describe('getContrastingColor', () => {
    test('returns a light color for a giving dark color', () => {
      expect(getContrastingColor('red')).toEqual('#fff');
    });

    test('returns a dark color for a giving light color', () => {
      expect(getContrastingColor('white')).toEqual('#000');
    });

    test('returns a predefined color for Transparent', () => {
      expect(getContrastingColor('transparent')).toEqual('rgba(0,0,0,0.4)');
    });

    test('returns a light color as default for undefined', () => {
      expect(getContrastingColor(undefined)).toEqual('#fff');
    });
  });
});

describe('validColorString', () => {
  test('checks for valid RGB string', () => {
    expect(isvalidColorString('23, 32, 3', 'rgb')).toBeTruthy();
    expect(isvalidColorString('290, 302, 3', 'rgb')).toBeTruthy();
    expect(isvalidColorString('23', 'rgb')).toBeFalsy();
    expect(isvalidColorString('230, 32', 'rgb')).toBeFalsy();
  });

  test('checks for valid HSL string', () => {
    expect(isvalidColorString('200, 12, 93', 'hsl')).toBeTruthy();
    expect(isvalidColorString('200, 12%, 93%', 'hsl')).toBeTruthy();
    expect(isvalidColorString('200, 120, 93%', 'hsl')).toBeTruthy();
    expect(isvalidColorString('335°, 64%, 99%', 'hsl')).toBeTruthy();
    expect(isvalidColorString('100', 'hsl')).toBeFalsy();
    expect(isvalidColorString('20, 32', 'hsl')).toBeFalsy();
  });

  test('checks for valid HSV string', () => {
    expect(isvalidColorString('200, 12, 93', 'hsv')).toBeTruthy();
    expect(isvalidColorString('200, 120, 93%', 'hsv')).toBeTruthy();
    expect(isvalidColorString('200°, 6%, 100%', 'hsv')).toBeTruthy();
    expect(isvalidColorString('1', 'hsv')).toBeFalsy();
    expect(isvalidColorString('20, 32', 'hsv')).toBeFalsy();
    expect(isvalidColorString('200°, ee3, 100%', 'hsv')).toBeFalsy();
  });
});
