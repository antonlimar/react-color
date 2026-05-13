import { ColorWrap, Hue } from '@/components/common';
import { bem, getThemeDataAttributes } from '@/components/common/styleArchitecture';
import { getDeprecatedStyleOverride } from '@/components/common/styleOverrides';
import './Slider.scss';
import { SliderSwatches } from '@/components/slider/SliderSwatches';
import { SliderPointer } from '@/components/slider/SliderPointer';

import type {
  ClassName,
  ColorPickerInjectedProps,
  HueProps,
  PickerClassNames,
  PickerCustomStyles,
  PickerTheme,
} from '@/types';

const b = bem('slider');

const SLIDER_STYLE_SLOTS = ['wrap', 'hue', 'swatches'] as const;

type SliderProps = ColorPickerInjectedProps & {
  pointer?: HueProps['pointer'];
  styles?: PickerCustomStyles;
  className?: ClassName;
  classNames?: PickerClassNames;
  theme?: PickerTheme;
};

function SliderBase({
  hsl,
  onChange,
  pointer = SliderPointer,
  styles: passedStyles = {},
  className = '',
  classNames,
  theme,
}: SliderProps) {
  const rootStyle = getDeprecatedStyleOverride(passedStyles, 'wrap', SLIDER_STYLE_SLOTS, 'wrap');
  const hueStyle = getDeprecatedStyleOverride(passedStyles, 'hue', SLIDER_STYLE_SLOTS, 'hue');
  const swatchesStyle = getDeprecatedStyleOverride(passedStyles, 'swatches', SLIDER_STYLE_SLOTS, 'swatches');

  return (
    <div
      style={rootStyle}
      className={b({ dark: theme === 'dark', light: theme === 'light' })
        .mix('slider-picker', className, classNames?.root)
        .toString()}
      {...getThemeDataAttributes(theme)}
    >
      <div className={b('hue').toString()} style={hueStyle}>
        <Hue radius="2px" hsl={hsl} pointer={pointer} onChange={onChange} />
      </div>
      <div className={b('swatches-wrap').toString()} style={swatchesStyle}>
        <SliderSwatches hsl={hsl} onClick={onChange} />
      </div>
    </div>
  );
}

export const Slider = ColorWrap(SliderBase);
