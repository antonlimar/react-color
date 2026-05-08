declare module 'lodash-es' {
  type UnknownFunction = (...args: unknown[]) => unknown;

  type Throttled<T extends UnknownFunction> = T & {
    cancel(): void;
  };

  type Debounced<T extends UnknownFunction> = T & {
    cancel(): void;
    flush(): ReturnType<T>;
  };

  export function each<T>(
    collection: ArrayLike<T> | Record<string, T> | null | undefined,
    iteratee: (value: T, key: number | string) => void,
  ): void;

  export function map<T, TResult>(
    collection: ArrayLike<T> | Record<string, T> | null | undefined,
    iteratee: (value: T, key: number | string) => TResult,
  ): TResult[];

  export function debounce<T extends UnknownFunction>(func: T, wait?: number): Debounced<T>;

  export function throttle<T extends UnknownFunction>(func: T, wait?: number): Throttled<T>;

  export function isUndefined(value: unknown): value is undefined;
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
