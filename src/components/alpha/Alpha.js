import { jsx as _jsx } from 'react/jsx-runtime';
import reactCSS from 'reactcss';
import { ColorWrap, Alpha as AlphaControl } from '../common';
import { getPickerRootProps } from '../common/styleArchitecture';
import AlphaPointer from './AlphaPointer';
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
}) => {
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
  return _jsx(
    'div',
    Object.assign(
      { style: styles.picker },
      getPickerRootProps({
        block: 'alpha',
        theme,
        className: `alpha-picker ${className}`,
        classNames,
      }),
      {
        children: _jsx(
          AlphaControl,
          Object.assign({}, styles.alpha, {
            rgb: rgb,
            hsl: hsl,
            pointer: pointer,
            renderers: renderers,
            onChange: onChange,
            direction: direction,
          }),
        ),
      },
    ),
  );
};
export default ColorWrap(AlphaPicker);
