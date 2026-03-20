import * as React from 'react'

export type Color = string | RGBColor | RGBAColor | HSLColor | HSLAColor | HSVColor | HSVAColor

export interface RGBColor {
  r: number
  g: number
  b: number
}

export interface RGBAColor extends RGBColor {
  a: number
}

export interface HSLColor {
  h: number
  s: number
  l: number
}

export interface HSLAColor extends HSLColor {
  a: number
}

export interface HSVColor {
  h: number
  s: number
  v: number
}

export interface HSVAColor extends HSVColor {
  a: number
}

export interface ColorResult {
  hex: string
  rgb: RGBAColor
  hsl: HSLAColor
  hsv: HSVAColor
  oldHue: number
  source?: string
}

export interface ColorPickerProps {
  color?: Color
  className?: string
  styles?: Record<string, unknown>
  onChange?: (color: ColorResult, event: unknown) => void
  onChangeComplete?: (color: ColorResult, event: unknown) => void
  onSwatchHover?: (color: ColorResult, event: unknown) => void
  [key: string]: unknown
}

export type ColorPickerComponent<Props = ColorPickerProps> = React.ComponentType<Props>

export type CustomPickerInjectedProps = ColorResult & {
  onChange: (color: Color, event?: unknown) => void
}

export function CustomPicker<Props extends object>(
  component: React.ComponentType<Props>,
): React.ComponentType<Omit<Props, keyof CustomPickerInjectedProps> & ColorPickerProps>

export const AlphaPicker: ColorPickerComponent
export const BlockPicker: ColorPickerComponent
export const CirclePicker: ColorPickerComponent
export const ChromePicker: ColorPickerComponent
export const CompactPicker: ColorPickerComponent
export const GithubPicker: ColorPickerComponent
export const HuePicker: ColorPickerComponent
export const MaterialPicker: ColorPickerComponent
export const PhotoshopPicker: ColorPickerComponent
export const SketchPicker: ColorPickerComponent
export const SliderPicker: ColorPickerComponent
export const SwatchesPicker: ColorPickerComponent
export const TwitterPicker: ColorPickerComponent
export const GooglePicker: ColorPickerComponent

export const Alpha: ColorPickerComponent
export const Checkboard: ColorPickerComponent
export const EditableInput: ColorPickerComponent
export const Hue: ColorPickerComponent
export const Raised: ColorPickerComponent
export const Saturation: ColorPickerComponent
export const Swatch: ColorPickerComponent

declare const ChromePickerDefault: typeof ChromePicker

export default ChromePickerDefault
