import type { ChangeEvent, ComponentType, CSSProperties, KeyboardEvent, MouseEvent, TouchEvent } from 'react';

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface RGBAColor extends RGBColor {
  a: number;
}

export interface HSLColor {
  h: number;
  s: number;
  l: number;
}

export interface HSLAColor extends HSLColor {
  a: number;
}

export interface HSVColor {
  h: number;
  s: number;
  v: number;
}

export interface HSVAColor extends HSVColor {
  a: number;
}

export type Color = string | RGBColor | RGBAColor | HSLColor | HSLAColor | HSVColor | HSVAColor;
export type ColorPickerComponent<Props = ColorPickerProps> = ComponentType<Props>;

export interface ColorChangeValue {
  hex?: string;
  '#'?: string;
  rgb?: string | RGBAColor;
  hsl?: string | HSLAColor;
  hsv?: string | HSVAColor;
  r?: number;
  g?: number;
  b?: number;
  a?: number;
  h?: number;
  s?: number | string;
  l?: number | string;
  v?: number;
  source?: string;
}

export interface ColorResult {
  hex: string;
  rgb: RGBAColor;
  hsl: HSLAColor;
  hsv: HSVAColor;
  oldHue: number;
  source?: string;
}

export type ColorPickerChangeEvent =
  | MouseEvent<HTMLElement>
  | TouchEvent<HTMLElement>
  | KeyboardEvent<HTMLElement>
  | ChangeEvent<HTMLInputElement>
  | globalThis.MouseEvent
  | globalThis.TouchEvent
  | globalThis.KeyboardEvent
  | undefined;

export type InternalColorChangeEvent =
  | MouseEvent<HTMLElement>
  | TouchEvent<HTMLElement>
  | globalThis.MouseEvent
  | globalThis.TouchEvent;

export type SwatchHoverEvent = MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement> | ColorPickerChangeEvent;

export type ColorChangeHandler = (color: ColorResult, event?: ColorPickerChangeEvent) => void;

export type ColorInputChangeHandler = (color: Color | ColorChangeValue, event?: ColorPickerChangeEvent) => void;

export type SwatchHoverHandler = (color: ColorResult, event?: ColorPickerChangeEvent) => void;

export type PickerStyle = CSSProperties & Record<string, unknown>;
export type PickerStyles = Record<string, PickerStyle | undefined>;
export type PickerCustomStyles = PickerStyles;
export type ClassName = string;
export type Radius = number | string;
export type PointerComponent<Props> = ComponentType<Props>;
export type PickerTheme = 'light' | 'dark' | 'auto';
export type PickerClassNames<Slot extends string = string> = Partial<Record<Slot | 'root', ClassName>>;

export interface ColorPickerStylingProps<Slot extends string = string> {
  className?: ClassName;
  classNames?: PickerClassNames<Slot>;
  theme?: PickerTheme;
  styles?: PickerCustomStyles;
}

export interface ColorPickerProps extends ColorPickerStylingProps {
  color?: Color;
  onChange?: ColorChangeHandler;
  onChangeComplete?: ColorChangeHandler;
  onSwatchHover?: SwatchHoverHandler;
  [key: string]: unknown;
}

export interface ColorPickerInjectedProps extends ColorResult {
  onChange: ColorInputChangeHandler;
  onSwatchHover?: ColorInputChangeHandler;
}

export type CustomPickerInjectedProps = ColorPickerInjectedProps;

export type { AlphaChange, AlphaProps } from './components/common/Alpha/types';
export type { CheckboardProps, CheckboardRenderers } from './components/common/Checkboard/types';
export type {
  EditableInputChangeEvent,
  EditableInputChangeValue,
  EditableInputProps,
  EditableInputStyle,
  EditableInputValue,
} from './components/common/EditableInput/types';
export type { HueChange, HueProps } from './components/common/Hue/types';
export type { RaisedProps } from './components/common/Raised/types';
export type { SaturationChange, SaturationProps, SaturationStyle } from './components/common/Saturation/types';
export type { SwatchProps } from './components/common/Swatch/types';
