import {
  ColorWrap,
  Hue as HueControl,
  bem,
  getThemeDataAttributes,
  getDeprecatedStyleOverride,
} from '@/components/common';
import type { HueProps } from '@/components/common';
import type { ClassName, ColorPickerInjectedProps, PickerClassNames, PickerCustomStyles, PickerTheme } from '@/types';
import { HuePointer } from '../HuePointer';
import './Hue.scss';

interface HuePickerProps extends ColorPickerInjectedProps {
  width?: string | number;
  height?: string | number;
  direction?: HueProps['direction'];
  pointer?: HueProps['pointer'];
  styles?: PickerCustomStyles;
  className?: ClassName;
  classNames?: PickerClassNames;
  theme?: PickerTheme;
}

const b = bem('hue');

const HUE_PICKER_STYLE_SLOTS = ['picker'] as const;

export function HuePicker({
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
}: HuePickerProps) {
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
      className={b({ dark: theme === 'dark', light: theme === 'light' }).mix('hue-picker', className, classNames?.root)}
      {...getThemeDataAttributes(theme)}
    >
      <HueControl hsl={hsl} radius="2px" pointer={pointer} onChange={handleChange} direction={direction} />
    </div>
  );
}

export const Hue = ColorWrap(HuePicker);
