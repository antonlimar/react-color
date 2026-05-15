declare module 'tinycolor2' {
  type TinyColorInput =
    | import('./types').Color
    | import('./types').ColorChangeValue
    | import('./types').PickerStyle
    | string
    | null
    | undefined;

  interface TinyColorInstance {
    isValid(): boolean;
    toHex(): string;
    toHsl(): import('./types').HSLAColor;
    toHsv(): import('./types').HSVAColor;
    toRgb(): import('./types').RGBAColor;
  }

  function tinycolor(color?: TinyColorInput): TinyColorInstance;

  export default tinycolor;
}
