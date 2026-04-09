import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import reactCSS from 'reactcss';
import * as color from '../../helpers/color';
import { EditableInput } from '../common';
export const SketchFields = ({ onChange, rgb, hsl, hex, disableAlpha }) => {
  const styles = reactCSS(
    {
      default: {
        fields: {
          display: 'flex',
          paddingTop: '4px',
        },
        single: {
          flex: '1',
          paddingLeft: '6px',
        },
        alpha: {
          flex: '1',
          paddingLeft: '6px',
        },
        double: {
          flex: '2',
        },
        input: {
          width: '80%',
          padding: '4px 10% 3px',
          border: 'none',
          boxShadow: 'inset 0 0 0 1px #ccc',
          fontSize: '11px',
        },
        label: {
          display: 'block',
          textAlign: 'center',
          fontSize: '11px',
          color: '#222',
          paddingTop: '3px',
          paddingBottom: '4px',
          textTransform: 'capitalize',
        },
      },
      disableAlpha: {
        alpha: {
          display: 'none',
        },
      },
    },
    { disableAlpha },
  );
  const handleChange = (data, event) => {
    if (data.hex) {
      if (color.isValidHex(data.hex)) {
        onChange(
          {
            hex: data.hex,
            source: 'hex',
          },
          event,
        );
      }
    } else if (data.r || data.g || data.b) {
      onChange(
        {
          r: data.r || rgb.r,
          g: data.g || rgb.g,
          b: data.b || rgb.b,
          a: rgb.a,
          source: 'rgb',
        },
        event,
      );
    } else if (!isNaN(Number(data.a))) {
      let alpha = Number(data.a);
      if (alpha < 0) {
        alpha = 0;
      } else if (alpha > 100) {
        alpha = 100;
      }
      onChange(
        {
          h: hsl.h,
          s: hsl.s,
          l: hsl.l,
          a: alpha / 100,
          source: 'rgb',
        },
        event,
      );
    }
  };
  return _jsxs('div', {
    style: styles.fields,
    className: 'flexbox-fix',
    children: [
      _jsx('div', {
        style: styles.double,
        children: _jsx(EditableInput, {
          style: { input: styles.input, label: styles.label },
          label: 'hex',
          value: hex.replace('#', ''),
          onChange: (value, event) => handleChange(value, event),
        }),
      }),
      _jsx('div', {
        style: styles.single,
        children: _jsx(EditableInput, {
          style: { input: styles.input, label: styles.label },
          label: 'r',
          value: rgb.r,
          onChange: (value, event) => handleChange(value, event),
          dragLabel: true,
          dragMax: 255,
        }),
      }),
      _jsx('div', {
        style: styles.single,
        children: _jsx(EditableInput, {
          style: { input: styles.input, label: styles.label },
          label: 'g',
          value: rgb.g,
          onChange: (value, event) => handleChange(value, event),
          dragLabel: true,
          dragMax: 255,
        }),
      }),
      _jsx('div', {
        style: styles.single,
        children: _jsx(EditableInput, {
          style: { input: styles.input, label: styles.label },
          label: 'b',
          value: rgb.b,
          onChange: (value, event) => handleChange(value, event),
          dragLabel: true,
          dragMax: 255,
        }),
      }),
      _jsx('div', {
        style: styles.alpha,
        children: _jsx(EditableInput, {
          style: { input: styles.input, label: styles.label },
          label: 'a',
          value: Math.round(rgb.a * 100),
          onChange: (value, event) => handleChange(value, event),
          dragLabel: true,
          dragMax: 100,
        }),
      }),
    ],
  });
};
export default SketchFields;
