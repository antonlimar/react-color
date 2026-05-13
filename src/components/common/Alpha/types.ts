import type {
  CheckboardRenderers,
  HSLAColor,
  InternalColorChangeEvent,
  PickerStyle,
  PointerComponent,
  Radius,
  RGBAColor,
} from '@/types';

export interface AlphaChange extends HSLAColor {
  source: string;
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
