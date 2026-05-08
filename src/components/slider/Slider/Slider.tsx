import { ColorWrap, Hue } from '@/components/common';
import { getPickerClassName, getPickerRootProps } from '@/components/common/styleArchitecture';
import { getDeprecatedStyleOverride } from '@/components/common/styleOverrides';
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

const SLIDER_STYLE_SLOTS = ['wrap', 'hue', 'swatches'] as const;

type SliderProps = ColorPickerInjectedProps & {
  pointer?: HueProps['pointer'];
  styles?: PickerCustomStyles;
  className?: ClassName;
  classNames?: PickerClassNames;
  theme?: PickerTheme;
};

const SliderBase = ({
  hsl,
  onChange,
  pointer = SliderPointer,
  styles: passedStyles = {},
  className = '',
  classNames,
  theme,
}: SliderProps) => {
  const rootStyle = getDeprecatedStyleOverride(passedStyles, 'wrap', SLIDER_STYLE_SLOTS, 'wrap');
  const hueStyle = getDeprecatedStyleOverride(passedStyles, 'hue', SLIDER_STYLE_SLOTS, 'hue');
  const swatchesStyle = getDeprecatedStyleOverride(passedStyles, 'swatches', SLIDER_STYLE_SLOTS, 'swatches');

  return (
    <div
      style={rootStyle}
      {...getPickerRootProps({
        block: 'slider',
        theme,
        className: `slider-picker ${className}`,
        classNames,
      })}
    >
      <div className={getPickerClassName({ block: 'slider', slot: 'hue' })} style={hueStyle}>
        <Hue radius="2px" hsl={hsl} pointer={pointer} onChange={onChange} />
      </div>
      <div className={getPickerClassName({ block: 'slider', slot: 'swatches-wrap' })} style={swatchesStyle}>
        <SliderSwatches hsl={hsl} onClick={onChange} />
      </div>
    </div>
  );
};

export const Slider = ColorWrap(SliderBase);
