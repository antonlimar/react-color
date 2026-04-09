import reactCSS from 'reactcss';

import { ColorWrap, Alpha as AlphaControl } from '../common';
import { getPickerRootProps } from '../common/styleArchitecture';
import AlphaPointer from './AlphaPointer';
import type {
  AlphaProps,
  CheckboardRenderers,
  ClassName,
  ColorPickerInjectedProps,
  PickerClassNames,
  PickerStyle,
  PickerTheme,
} from '../../types';

type AlphaPickerProps = ColorPickerInjectedProps & {
  width?: string | number;
  height?: string | number;
  direction?: AlphaProps['direction'];
  style?: PickerStyle;
  renderers?: CheckboardRenderers;
  pointer?: AlphaProps['pointer'];
  className?: ClassName;
  classNames?: PickerClassNames;
  theme?: PickerTheme;
};

export const AlphaPicker = ({
  rgb,
  hsl,
  width = '316px',
  height = '16px',
  onChange,
  direction = 'horizontal',
  style,
  renderers,
  pointer = AlphaPointer,
  className = '',
  classNames,
  theme,
}: AlphaPickerProps) => {
  const styles = reactCSS({
    default: {
      picker: {
        position: 'relative',
        width,
        height,
      },
      alpha: {
        radius: '2px',
        style,
      },
    },
  });

  return (
    <div
      style={styles.picker}
      {...getPickerRootProps({
        block: 'alpha',
        theme,
        className: `alpha-picker ${className}`,
        classNames,
      })}
    >
      <AlphaControl
        {...styles.alpha}
        rgb={rgb}
        hsl={hsl}
        pointer={pointer}
        renderers={renderers}
        onChange={onChange}
        direction={direction}
      />
    </div>
  );
};

export default ColorWrap(AlphaPicker);
