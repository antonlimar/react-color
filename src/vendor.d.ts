declare module 'prop-types' {
  export interface Validator {
    isRequired: Validator
  }

  export interface PropTypesShape {
    string: Validator
    number: Validator
    bool: Validator
    object: Validator
    array: Validator
    func: Validator
    node: Validator
    element: Validator
    any: Validator
    oneOf(values: readonly unknown[]): Validator
    oneOfType(values: readonly Validator[]): Validator
    arrayOf(value: Validator): Validator
    shape(value: Record<string, Validator>): Validator
  }

  const PropTypes: PropTypesShape
  export default PropTypes
}

declare module 'lodash/each' {
  function each<T>(
    collection: ArrayLike<T> | Record<string, T> | null | undefined,
    iteratee: (value: T, key: number | string) => void,
  ): void

  export default each
}

declare module 'lodash/map' {
  function map<T, TResult>(
    collection: ArrayLike<T> | Record<string, T> | null | undefined,
    iteratee: (value: T, key: number | string) => TResult,
  ): TResult[]

  export default map
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

declare module 'lodash/debounce' {
  type UnknownFunction = (...args: unknown[]) => unknown

  type Debounced<T extends UnknownFunction> = T & {
    cancel(): void
    flush(): ReturnType<T>
  }

  function debounce<T extends UnknownFunction>(
    func: T,
    wait?: number,
  ): Debounced<T>

  export default debounce
}

declare module 'lodash/isUndefined' {
  function isUndefined(value: unknown): value is undefined
  export default isUndefined
}

declare module 'reactcss' {
  function reactCSS(...args: unknown[]): import('./types').PickerStyles
  export function handleHover<T>(component: T): T

  export default reactCSS
}

declare module 'material-colors' {
  const materialColors: Record<string, Record<string, string>>
  export default materialColors
}

declare module '@icons/material/CheckIcon' {
  import type { ComponentType, SVGProps } from 'react'

  const CheckIcon: ComponentType<SVGProps<SVGSVGElement>>
  export default CheckIcon
}

declare module '@icons/material/UnfoldMoreHorizontalIcon' {
  import type { ComponentType, SVGProps } from 'react'

  const UnfoldMoreHorizontalIcon: ComponentType<SVGProps<SVGSVGElement>>
  export default UnfoldMoreHorizontalIcon
}

declare module 'tinycolor2' {
  type TinyColorInput =
    | import('./types').Color
    | import('./types').ColorChangeValue
    | import('./types').PickerStyle
    | string
    | null
    | undefined

  interface TinyColorInstance {
    _ok: boolean
    isValid(): boolean
    toHex(): string
    toHsl(): import('./types').HSLAColor
    toHsv(): import('./types').HSVAColor
    toRgb(): import('./types').RGBAColor
  }

  function tinycolor(color?: TinyColorInput): TinyColorInstance

  export default tinycolor
}
