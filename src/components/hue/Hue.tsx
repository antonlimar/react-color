import reactCSS from 'reactcss';
import merge from 'lodash/merge';

import { ColorWrap, Hue as HueControl } from '../common';
import { getPickerRootProps } from '../common/styleArchitecture';
import HuePointer from './HuePointer';
import type {
  ClassName,
  ColorPickerInjectedProps,
  HueProps,
  PickerClassNames,
  PickerCustomStyles,
  PickerTheme,
} from '../../types';

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
  const styles = reactCSS(
    merge(
      {
        default: {
          picker: {
            position: 'relative',
            width,
            height,
          },
          hue: {
            radius: '2px',
          },
        },
      },
      passedStyles,
    ),
  );

  const handleChange: HueProps['onChange'] = (data) => {
    onChange({ a: 1, h: data.h, l: 0.5, s: 1 });
  };

  return (
    <div
      style={styles.picker}
      {...getPickerRootProps({
        block: 'hue',
        theme,
        className: `hue-picker ${className}`,
        classNames,
      })}
    >
      <HueControl {...styles.hue} hsl={hsl} pointer={pointer} onChange={handleChange} direction={direction} />
    </div>
  );
};

export default ColorWrap(HuePicker);
