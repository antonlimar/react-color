declare module 'lodash/each' {
  function each<T>(
    collection: ArrayLike<T> | Record<string, T> | null | undefined,
    iteratee: (value: T, key: number | string) => void,
  ): void

  export default each
}

declare module 'lodash/merge' {
  function merge<TObject, TSource>(
    object: TObject,
    source: TSource,
  ): TObject & TSource

  export default merge
}

declare module 'lodash/throttle' {
  type UnknownFunction = (...args: unknown[]) => unknown

  type Throttled<T extends UnknownFunction> = T & {
    cancel(): void
  }

  function throttle<T extends UnknownFunction>(
    func: T,
    wait?: number,
  ): Throttled<T>

  export default throttle
}

declare module 'reactcss' {
  function reactCSS(...args: unknown[]): Record<string, Record<string, unknown>>
  export function handleHover<T>(component: T): T

  export default reactCSS
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
