import type { HSLAColor, InternalColorChangeEvent, PickerStyle, PointerComponent, Radius } from '@/types';

export interface HueChange extends HSLAColor {
  source: string;
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
