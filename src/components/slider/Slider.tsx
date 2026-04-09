import reactCSS from 'reactcss';
import merge from 'lodash/merge';

import { ColorWrap, Hue } from '../common';
import { getPickerRootProps } from '../common/styleArchitecture';
import SliderSwatches from './SliderSwatches';
import SliderPointer from './SliderPointer';
import type {
  ClassName,
  ColorPickerInjectedProps,
  HueProps,
  PickerClassNames,
  PickerCustomStyles,
  PickerTheme,
} from '../../types';

type SliderProps = ColorPickerInjectedProps & {
  pointer?: HueProps['pointer'];
  styles?: PickerCustomStyles;
  className?: ClassName;
  classNames?: PickerClassNames;
  theme?: PickerTheme;
};

export const Slider = ({
  hsl,
  onChange,
  pointer = SliderPointer,
  styles: passedStyles = {},
  className = '',
  classNames,
  theme,
}: SliderProps) => {
  const styles = reactCSS(
    merge(
      {
        default: {
          hue: {
            height: '12px',
            position: 'relative',
          },
          Hue: {
            radius: '2px',
          },
        },
      },
      passedStyles,
    ),
  );

  return (
    <div
      style={styles.wrap || {}}
      {...getPickerRootProps({
        block: 'slider',
        theme,
        className: `slider-picker ${className}`,
        classNames,
      })}
    >
      <div style={styles.hue}>
        <Hue style={styles.Hue} hsl={hsl} pointer={pointer} onChange={onChange} />
      </div>
      <div style={styles.swatches}>
        <SliderSwatches hsl={hsl} onClick={onChange} />
      </div>
    </div>
  );
};

export default ColorWrap(Slider);
