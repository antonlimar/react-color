import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import reactCSS from 'reactcss';
import merge from 'lodash/merge';
import { ColorWrap, Saturation, Hue, Alpha, Checkboard } from '../common';
import { getPickerRootProps } from '../common/styleArchitecture';
import SketchFields from './SketchFields';
import SketchPresetColors from './SketchPresetColors';
const DEFAULT_SKETCH_PRESET_COLORS = [
  '#D0021B',
  '#F5A623',
  '#F8E71C',
  '#8B572A',
  '#7ED321',
  '#417505',
  '#BD10E0',
  '#9013FE',
  '#4A90E2',
  '#50E3C2',
  '#B8E986',
  '#000000',
  '#4A4A4A',
  '#9B9B9B',
  '#FFFFFF',
];
export const Sketch = ({
  width = 200,
  rgb,
  hex,
  hsv,
  hsl,
  onChange,
  onSwatchHover,
  disableAlpha = false,
  presetColors = DEFAULT_SKETCH_PRESET_COLORS,
  renderers,
  styles: passedStyles = {},
  className = '',
  classNames,
  theme,
}) => {
  const styles = reactCSS(
    merge(
      {
        default: Object.assign(
          {
            picker: {
              width,
              padding: '10px 10px 0',
              boxSizing: 'initial',
              background: '#fff',
              borderRadius: '4px',
              boxShadow: '0 0 0 1px rgba(0,0,0,.15), 0 8px 16px rgba(0,0,0,.15)',
            },
            saturation: {
              width: '100%',
              paddingBottom: '75%',
              position: 'relative',
              overflow: 'hidden',
            },
            Saturation: {
              radius: '3px',
              shadow: 'inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)',
            },
            controls: {
              display: 'flex',
            },
            sliders: {
              padding: '4px 0',
              flex: '1',
            },
            color: {
              width: '24px',
              height: '24px',
              position: 'relative',
              marginTop: '4px',
              marginLeft: '4px',
              borderRadius: '3px',
            },
            activeColor: {
              absolute: '0px 0px 0px 0px',
              borderRadius: '2px',
              background: `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`,
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)',
            },
            hue: {
              position: 'relative',
              height: '10px',
              overflow: 'hidden',
            },
            Hue: {
              radius: '2px',
              shadow: 'inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)',
            },
            alpha: {
              position: 'relative',
              height: '10px',
              marginTop: '4px',
              overflow: 'hidden',
            },
            Alpha: {
              radius: '2px',
              shadow: 'inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)',
            },
          },
          passedStyles,
        ),
        disableAlpha: {
          color: {
            height: '10px',
          },
          hue: {
            height: '10px',
          },
          alpha: {
            display: 'none',
          },
        },
      },
      passedStyles,
    ),
    { disableAlpha },
  );
  return _jsxs(
    'div',
    Object.assign(
      { style: styles.picker },
      getPickerRootProps({
        block: 'sketch',
        theme,
        modifiers: [disableAlpha && 'disabled-alpha'],
        className: `sketch-picker ${className}`,
        classNames,
      }),
      {
        children: [
          _jsx('div', {
            style: styles.saturation,
            children: _jsx(Saturation, { style: styles.Saturation, hsl: hsl, hsv: hsv, onChange: onChange }),
          }),
          _jsxs('div', {
            style: styles.controls,
            className: 'flexbox-fix',
            children: [
              _jsxs('div', {
                style: styles.sliders,
                children: [
                  _jsx('div', {
                    style: styles.hue,
                    children: _jsx(Hue, { style: styles.Hue, hsl: hsl, onChange: onChange }),
                  }),
                  _jsx('div', {
                    style: styles.alpha,
                    children: _jsx(Alpha, {
                      style: styles.Alpha,
                      rgb: rgb,
                      hsl: hsl,
                      renderers: renderers,
                      onChange: onChange,
                    }),
                  }),
                ],
              }),
              _jsxs('div', {
                style: styles.color,
                children: [_jsx(Checkboard, {}), _jsx('div', { style: styles.activeColor })],
              }),
            ],
          }),
          _jsx(SketchFields, { rgb: rgb, hsl: hsl, hex: hex, onChange: onChange, disableAlpha: disableAlpha }),
          _jsx(SketchPresetColors, { colors: presetColors, onClick: onChange, onSwatchHover: onSwatchHover }),
        ],
      },
    ),
  );
};
export default ColorWrap(Sketch);
