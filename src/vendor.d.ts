declare module 'lodash-es' {
  type UnknownFunction = (...args: unknown[]) => unknown;

  type Throttled<T extends UnknownFunction> = T & {
    cancel(): void;
  };

  type Debounced<T extends UnknownFunction> = T & {
    cancel(): void;
    flush(): ReturnType<T>;
  };

  export function debounce<T extends UnknownFunction>(func: T, wait?: number): Debounced<T>;

  export function throttle<T extends UnknownFunction>(func: T, wait?: number): Throttled<T>;
}

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
