import { ColorWrap, Hue as HueControl } from '@/components/common';
import { getPickerRootProps } from '@/components/common/styleArchitecture';
import { getDeprecatedStyleOverride } from '@/components/common/styleOverrides';
import { HuePointer } from '@/components/hue/HuePointer';
import type {
  ClassName,
  ColorPickerInjectedProps,
  HueProps,
  PickerClassNames,
  PickerCustomStyles,
  PickerTheme,
} from '@/types';

const HUE_PICKER_STYLE_SLOTS = ['picker'] as const;

type HuePickerProps = ColorPickerInjectedProps & {
  width?: string | number;
  height?: string | number;
  direction?: HueProps['direction'];
  pointer?: HueProps['pointer'];
  styles?: PickerCustomStyles;
  className?: ClassName;
  classNames?: PickerClassNames;
  theme?: PickerTheme;
};

export const HuePicker = ({
  width = '316px',
  height = '16px',
  onChange,
  hsl,
  direction = 'horizontal',
  pointer = HuePointer,
  styles: passedStyles = {},
  className = '',
  classNames,
  theme,
}: HuePickerProps) => {
  const handleChange: HueProps['onChange'] = (data) => {
    onChange({ a: 1, h: data.h, l: 0.5, s: 1 });
  };

  const rootStyle = {
    width,
    height,
    ...getDeprecatedStyleOverride(passedStyles, 'picker', HUE_PICKER_STYLE_SLOTS, 'picker'),
  };

  return (
    <div
      style={rootStyle}
      {...getPickerRootProps({
        block: 'hue',
        theme,
        className: `hue-picker ${className}`,
        classNames,
      })}
    >
      <HueControl hsl={hsl} radius="2px" pointer={pointer} onChange={handleChange} direction={direction} />
    </div>
  );
};

export const Hue = ColorWrap(HuePicker);
