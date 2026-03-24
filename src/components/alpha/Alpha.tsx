import reactCSS from 'reactcss';

import { ColorWrap, Alpha as AlphaControl } from '../common';
import AlphaPointer from './AlphaPointer';
import type { AlphaProps, CheckboardRenderers, ClassName, ColorPickerInjectedProps, PickerStyle } from '../../types';

type AlphaPickerProps = ColorPickerInjectedProps & {
  width?: string | number;
  height?: string | number;
  direction?: AlphaProps['direction'];
  style?: PickerStyle;
  renderers?: CheckboardRenderers;
  pointer?: AlphaProps['pointer'];
  className?: ClassName;
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
    <div style={styles.picker} className={`alpha-picker ${className}`}>
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
