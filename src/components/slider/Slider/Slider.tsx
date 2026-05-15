import { ColorWrap, Hue, bem, getThemeDataAttributes, getDeprecatedStyleOverride } from '@/components/common';
import type { HueProps } from '@/components/common';
import type { ClassName, ColorPickerInjectedProps, PickerClassNames, PickerCustomStyles, PickerTheme } from '@/types';
import { SliderPointer } from '../SliderPointer';
import { SliderSwatches } from '../SliderSwatches';
import './Slider.scss';

type SliderProps = ColorPickerInjectedProps & {
  pointer?: HueProps['pointer'];
  styles?: PickerCustomStyles;
  className?: ClassName;
  classNames?: PickerClassNames;
  theme?: PickerTheme;
};

const b = bem('slider');

const SLIDER_STYLE_SLOTS = ['wrap', 'hue', 'swatches'] as const;

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
      className={b({ dark: theme === 'dark', light: theme === 'light' }).mix(
        'slider-picker',
        className,
        classNames?.root,
      )}
      {...getThemeDataAttributes(theme)}
    >
      <div className={b('hue')} style={hueStyle}>
        <Hue radius="2px" hsl={hsl} pointer={pointer} onChange={onChange} />
      </div>
      <div className={b('swatches-wrap')} style={swatchesStyle}>
        <SliderSwatches hsl={hsl} onClick={onChange} />
      </div>
    </div>
  );
}

export const Slider = ColorWrap(SliderBase);
