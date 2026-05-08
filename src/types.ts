import type {
  ChangeEvent,
  ComponentType,
  CSSProperties,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  TouchEvent,
} from 'react';

export type ColorSource = string;

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
  source?: ColorSource;
}

export interface ColorResult {
  hex: string;
  rgb: RGBAColor;
  hsl: HSLAColor;
  hsv: HSVAColor;
  oldHue: number;
  source?: ColorSource;
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

export interface AlphaChange extends HSLAColor {
  source: ColorSource;
}

export interface HueChange extends HSLAColor {
  source: ColorSource;
}

export interface SaturationChange extends HSVAColor {
  source: ColorSource;
}

export interface CheckboardRenderers {
  canvas?: new () => {
    width: number;
    height: number;
    getContext(contextId: '2d'): {
      fillStyle: string;
      fillRect(x: number, y: number, width: number, height: number): void;
      translate(x: number, y: number): void;
    } | null;
    toDataURL(): string;
  };
  [key: string]: unknown;
}

export interface CheckboardProps {
  white?: string;
  grey?: string;
  size?: number;
  renderers?: CheckboardRenderers;
  borderRadius?: Radius;
  boxShadow?: string;
  children?: ReactNode;
}

export interface RaisedProps {
  background?: string;
  zDepth?: 0 | 1 | 2 | 3 | 4 | 5;
  radius?: number;
  style?: PickerStyle;
  styles?: PickerCustomStyles;
  theme?: PickerTheme;
  children?: ReactNode;
}

export interface SwatchProps {
  color: string;
  style?: PickerStyle;
  onClick?: (color: string, event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => void;
  onHover?: (color: string, event: MouseEvent<HTMLDivElement>) => void;
  title?: string;
  children?: ReactNode;
  focus?: boolean;
  focusStyle?: PickerStyle;
}

export interface EditableInputStyle {
  wrap?: PickerStyle;
  input?: PickerStyle;
  label?: PickerStyle;
}

export type EditableInputValue = string | number;
export type EditableInputChangeValue = EditableInputValue | Record<string, EditableInputValue>;

export type EditableInputChangeEvent =
  | ChangeEvent<HTMLInputElement>
  | KeyboardEvent<HTMLInputElement>
  | globalThis.MouseEvent;

export interface EditableInputProps {
  label?: string | null;
  value?: EditableInputValue;
  placeholder?: string;
  arrowOffset?: number;
  dragLabel?: boolean;
  dragMax?: number;
  style?: EditableInputStyle;
  hideLabel?: boolean;
  onChange?: (value: EditableInputChangeValue, event: EditableInputChangeEvent) => void;
}

export interface AlphaProps {
  rgb: RGBAColor;
  hsl: HSLAColor;
  a?: number;
  direction?: 'horizontal' | 'vertical';
  pointer?: PointerComponent<AlphaProps>;
  renderers?: CheckboardRenderers;
  style?: PickerStyle;
  radius?: Radius;
  shadow?: string;
  onChange?: (color: AlphaChange, event: InternalColorChangeEvent) => void;
}

export interface HueProps {
  hsl: HSLAColor;
  direction?: 'horizontal' | 'vertical';
  pointer?: PointerComponent<HueProps>;
  style?: PickerStyle;
  radius?: Radius;
  shadow?: string;
  onChange?: (color: HueChange, event: InternalColorChangeEvent) => void;
}

export interface SaturationStyle {
  color?: PickerStyle;
  white?: PickerStyle;
  black?: PickerStyle;
  pointer?: PickerStyle;
  circle?: PickerStyle;
}

export interface SaturationProps {
  hsl: HSLAColor;
  hsv: HSVAColor;
  pointer?: PointerComponent<SaturationProps>;
  style?: SaturationStyle;
  radius?: Radius;
  shadow?: string;
  onChange?: (color: SaturationChange, event: InternalColorChangeEvent) => void;
}
