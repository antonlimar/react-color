import { ColorWrap, Saturation, Hue, Alpha, Checkboard } from '@/components/common';
import { getPickerClassName, getPickerRootProps } from '@/components/common/styleArchitecture';
import { getDeprecatedStyleOverride } from '@/components/common/styleOverrides';
import { SketchFields } from '@/components/sketch/SketchFields';
import { SketchPresetColors } from '@/components/sketch/SketchPresetColors';
import type {
  CheckboardRenderers,
  ClassName,
  ColorPickerInjectedProps,
  PickerClassNames,
  PickerCustomStyles,
  PickerTheme,
} from '@/types';

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
      {...getPickerRootProps({
        block: 'sketch',
        theme,
        modifiers: [disableAlpha && 'disabled-alpha'],
        className: `sketch-picker ${className}`,
        classNames,
      })}
    >
      <div className={getPickerClassName({ block: 'sketch', slot: 'saturation' })} style={saturationStyle}>
        <Saturation
          radius="3px"
          shadow="inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)"
          hsl={hsl}
          hsv={hsv}
          onChange={onChange}
        />
      </div>
      <div
        className={getPickerClassName({ block: 'sketch', slot: 'controls', className: 'flexbox-fix' })}
        style={controlsStyle}
      >
        <div className={getPickerClassName({ block: 'sketch', slot: 'sliders' })} style={slidersStyle}>
          <div className={getPickerClassName({ block: 'sketch', slot: 'hue' })} style={hueStyle}>
            <Hue
              radius="2px"
              shadow="inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)"
              hsl={hsl}
              onChange={onChange}
            />
          </div>
          <div className={getPickerClassName({ block: 'sketch', slot: 'alpha' })} style={alphaStyle}>
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
        <div className={getPickerClassName({ block: 'sketch', slot: 'color' })} style={colorStyle}>
          <Checkboard />
          <div className={getPickerClassName({ block: 'sketch', slot: 'active-color' })} style={activeColorStyle} />
        </div>
      </div>

      <SketchFields rgb={rgb} hsl={hsl} hex={hex} onChange={onChange} disableAlpha={disableAlpha} />
      <SketchPresetColors colors={presetColors!} onClick={onChange} onSwatchHover={onSwatchHover} />
    </div>
  );
}

export const Sketch = ColorWrap(SketchBase);
