import { jsx as _jsx } from 'react/jsx-runtime';
import reactCSS from 'reactcss';
import merge from 'lodash/merge';
import { ColorWrap, Hue as HueControl } from '../common';
import { getPickerRootProps } from '../common/styleArchitecture';
import HuePointer from './HuePointer';
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
}) => {
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
  const handleChange = (data) => {
    onChange({ a: 1, h: data.h, l: 0.5, s: 1 });
  };
  return _jsx(
    'div',
    Object.assign(
      { style: styles.picker },
      getPickerRootProps({
        block: 'hue',
        theme,
        className: `hue-picker ${className}`,
        classNames,
      }),
      {
        children: _jsx(
          HueControl,
          Object.assign({}, styles.hue, { hsl: hsl, pointer: pointer, onChange: handleChange, direction: direction }),
        ),
      },
    ),
  );
};
export default ColorWrap(HuePicker);
