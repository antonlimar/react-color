declare module 'lodash/each' {
  function each<T>(
    collection: ArrayLike<T> | Record<string, T> | null | undefined,
    iteratee: (value: T, key: number | string) => void,
  ): void

  export default each
}

declare module 'tinycolor2' {
  interface HSLColor {
    h: number
    s: number
    l: number
    a: number
  }

  interface HSVColor {
    h: number
    s: number
    v: number
    a: number
  }

  interface RGBColor {
    r: number
    g: number
    b: number
    a: number
  }

  interface TinyColorInstance {
    _ok: boolean
    isValid(): boolean
    toHex(): string
    toHsl(): HSLColor
    toHsv(): HSVColor
    toRgb(): RGBColor
  }

  function tinycolor(color?: unknown): TinyColorInstance

  export default tinycolor
}
