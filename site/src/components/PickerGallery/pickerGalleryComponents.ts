import {
  AlphaPicker,
  BlockPicker,
  ChromePicker,
  CirclePicker,
  CompactPicker,
  GithubPicker,
  GooglePicker,
  HuePicker,
  MaterialPicker,
  PhotoshopPicker,
  SketchPicker,
  SliderPicker,
  SwatchesPicker,
  TwitterPicker,
} from 'react-color';
import type { ColorPickerComponent, ColorPickerProps } from 'react-color';

export const pickerGalleryComponents: Record<string, ColorPickerComponent> = {
  alpha: AlphaPicker,
  block: BlockPicker,
  chrome: ChromePicker,
  circle: CirclePicker,
  compact: CompactPicker,
  github: GithubPicker,
  google: GooglePicker,
  hue: HuePicker,
  material: MaterialPicker,
  photoshop: PhotoshopPicker,
  sketch: SketchPicker,
  slider: SliderPicker,
  swatches: SwatchesPicker,
  twitter: TwitterPicker,
};

export const pickerGalleryPreviewProps: Record<string, ColorPickerProps> = {
  alpha: { width: '100%' },
  google: { width: 420 },
  hue: { width: '100%' },
  photoshop: {
    onCancel: () => undefined,
    styles: { default: { picker: { boxShadow: 'var(--site-picker-gallery-shadow)' } } },
  },
  slider: { styles: { default: { wrap: { width: '100%' } } } },
  swatches: { width: 320, height: 220 },
};
