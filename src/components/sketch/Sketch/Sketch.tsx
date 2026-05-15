import {
  ColorWrap,
  Saturation,
  Hue,
  Alpha,
  Checkboard,
  bem,
  getThemeDataAttributes,
  getDeprecatedStyleOverride,
} from '@/components/common';
import { SketchFields } from '@/components/sketch/SketchFields';
import { SketchPresetColors } from '@/components/sketch/SketchPresetColors';
import './Sketch.scss';

import type {
  CheckboardRenderers,
  ClassName,
  ColorPickerInjectedProps,
  PickerClassNames,
  PickerCustomStyles,
  PickerTheme,
} from '@/types';

const b = bem('sketch');

type SketchPresetColor = string | { color: string; title?: string };

type SketchProps = ColorPickerInjectedProps & {
  disableAlpha?: boolean;
  width?: string | number;
  styles?: PickerCustomStyles;
  presetColors?: SketchPresetColor[];
  renderers?: CheckboardRenderers;
  className?: ClassName;
  classNames?: PickerClassNames;
  theme?: PickerTheme;
};

const DEFAULT_SKETCH_PRESET_COLORS = [
  '#D0021B',
  '#F5A623',
  '#F8E71C',
  '#8B572A',
  '#7ED321',
  '#417505',
  '#BD10E0',
  '#9013FE',
  '#4A90E2',
  '#50E3C2',
  '#B8E986',
  '#000000',
  '#4A4A4A',
  '#9B9B9B',
  '#FFFFFF',
];

const SKETCH_STYLE_SLOTS = [
  'picker',
  'saturation',
  'controls',
  'sliders',
  'color',
  'activeColor',
  'hue',
  'alpha',
] as const;

function SketchBase({
  width = 200,
  rgb,
  hex,
  hsv,
  hsl,
  onChange,
  onSwatchHover,
  disableAlpha = false,
  presetColors = DEFAULT_SKETCH_PRESET_COLORS,
  renderers,
  styles: passedStyles = {},
  className = '',
  classNames,
  theme,
}: SketchProps) {
  const rootStyle = {
    width,
    ...getDeprecatedStyleOverride(passedStyles, 'picker', SKETCH_STYLE_SLOTS, 'picker'),
  };
  const saturationStyle = getDeprecatedStyleOverride(passedStyles, 'saturation', SKETCH_STYLE_SLOTS, 'saturation');
  const controlsStyle = getDeprecatedStyleOverride(passedStyles, 'controls', SKETCH_STYLE_SLOTS, 'controls');
  const slidersStyle = getDeprecatedStyleOverride(passedStyles, 'sliders', SKETCH_STYLE_SLOTS, 'sliders');
  const colorStyle = getDeprecatedStyleOverride(passedStyles, 'color', SKETCH_STYLE_SLOTS, 'color');
  const activeColorStyle = {
    background: `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`,
    ...getDeprecatedStyleOverride(passedStyles, 'activeColor', SKETCH_STYLE_SLOTS, 'activeColor'),
  };
  const hueStyle = getDeprecatedStyleOverride(passedStyles, 'hue', SKETCH_STYLE_SLOTS, 'hue');
  const alphaStyle = getDeprecatedStyleOverride(passedStyles, 'alpha', SKETCH_STYLE_SLOTS, 'alpha');

  return (
    <div
      style={rootStyle}
      className={b({ 'disabled-alpha': disableAlpha, dark: theme === 'dark', light: theme === 'light' })
        .mix('sketch-picker', className, classNames?.root)
        .toString()}
      {...getThemeDataAttributes(theme)}
    >
      <div className={b('saturation').toString()} style={saturationStyle}>
        <Saturation
          radius="3px"
          shadow="inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)"
          hsl={hsl}
          hsv={hsv}
          onChange={onChange}
        />
      </div>
      <div className={b('controls').toString()} style={controlsStyle}>
        <div className={b('sliders').toString()} style={slidersStyle}>
          <div className={b('hue').toString()} style={hueStyle}>
            <Hue
              radius="2px"
              shadow="inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)"
              hsl={hsl}
              onChange={onChange}
            />
          </div>
          <div className={b('alpha').toString()} style={alphaStyle}>
            <Alpha
              radius="2px"
              shadow="inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)"
              rgb={rgb}
              hsl={hsl}
              renderers={renderers}
              onChange={onChange}
            />
          </div>
        </div>
        <div className={b('color').toString()} style={colorStyle}>
          <Checkboard />
          <div className={b('active-color').toString()} style={activeColorStyle} />
        </div>
      </div>

      <SketchFields rgb={rgb} hsl={hsl} hex={hex} onChange={onChange} disableAlpha={disableAlpha} />
      <SketchPresetColors colors={presetColors!} onClick={onChange} onSwatchHover={onSwatchHover} />
    </div>
  );
}

export const Sketch = ColorWrap(SketchBase);
