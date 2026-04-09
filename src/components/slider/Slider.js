import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import reactCSS from 'reactcss';
import merge from 'lodash/merge';
import { ColorWrap, Hue } from '../common';
import { getPickerRootProps } from '../common/styleArchitecture';
import SliderSwatches from './SliderSwatches';
import SliderPointer from './SliderPointer';
export const Slider = ({
  hsl,
  onChange,
  pointer = SliderPointer,
  styles: passedStyles = {},
  className = '',
  classNames,
  theme,
}) => {
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
  return _jsxs(
    'div',
    Object.assign(
      { style: styles.wrap || {} },
      getPickerRootProps({
        block: 'slider',
        theme,
        className: `slider-picker ${className}`,
        classNames,
      }),
      {
        children: [
          _jsx('div', {
            style: styles.hue,
            children: _jsx(Hue, { style: styles.Hue, hsl: hsl, pointer: pointer, onChange: onChange }),
          }),
          _jsx('div', { style: styles.swatches, children: _jsx(SliderSwatches, { hsl: hsl, onClick: onChange }) }),
        ],
      },
    ),
  );
};
export default ColorWrap(Slider);
