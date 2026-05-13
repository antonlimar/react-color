import type { HSLAColor, HSVAColor, InternalColorChangeEvent, PickerStyle, PointerComponent, Radius } from '@/types';

export interface SaturationChange extends HSVAColor {
  source: string;
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
