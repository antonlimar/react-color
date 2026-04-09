import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import reactCSS from 'reactcss';
import * as color from '../../helpers/color';
import { EditableInput } from '../common';
const normalizeAngleValue = (value) => value.replace('°', '');
const normalizePercentValue = (value) => value.replace('%', '');
export const GoogleFields = ({ onChange, rgb, hsl, hex, hsv }) => {
  const handleChange = (data, event) => {
    if (typeof data.hex === 'string') {
      if (color.isValidHex(data.hex)) {
        onChange(
          {
            hex: data.hex,
            source: 'hex',
          },
          event,
        );
      }
    } else if (typeof data.rgb === 'string') {
      const values = data.rgb.split(',');
      if (color.isvalidColorString(data.rgb, 'rgb')) {
        onChange(
          {
            r: Number(values[0]),
            g: Number(values[1]),
            b: Number(values[2]),
            a: 1,
            source: 'rgb',
          },
          event,
        );
      }
    } else if (typeof data.hsv === 'string') {
      const values = data.hsv.split(',');
      if (color.isvalidColorString(data.hsv, 'hsv')) {
        const normalizedHsv = [
          normalizeAngleValue(values[0]),
          normalizePercentValue(values[1]),
          normalizePercentValue(values[2]),
        ];
        if (normalizedHsv[1] === '1') {
          normalizedHsv[1] = '0.01';
        } else if (normalizedHsv[2] === '1') {
          normalizedHsv[2] = '0.01';
        }
        onChange(
          {
            h: Number(normalizedHsv[0]),
            s: Number(normalizedHsv[1]),
            v: Number(normalizedHsv[2]),
            source: 'hsv',
          },
          event,
        );
      }
    } else if (typeof data.hsl === 'string') {
      const values = data.hsl.split(',');
      if (color.isvalidColorString(data.hsl, 'hsl')) {
        const normalizedHsl = [
          normalizeAngleValue(values[0]),
          normalizePercentValue(values[1]),
          normalizePercentValue(values[2]),
        ];
        if (normalizedHsl[1] === '1') {
          normalizedHsl[1] = '0.01';
        } else if (normalizedHsl[2] === '1') {
          normalizedHsl[2] = '0.01';
        }
        onChange(
          {
            h: Number(normalizedHsl[0]),
            s: Number(normalizedHsl[1]),
            l: Number(normalizedHsl[2]),
            source: 'hsl',
          },
          event,
        );
      }
    }
  };
  const styles = reactCSS({
    default: {
      wrap: {
        display: 'flex',
        height: '100px',
        marginTop: '4px',
      },
      fields: {
        width: '100%',
      },
      column: {
        paddingTop: '10px',
        display: 'flex',
        justifyContent: 'space-between',
      },
      double: {
        padding: '0px 4.4px',
        boxSizing: 'border-box',
      },
      input: {
        width: '100%',
        height: '38px',
        boxSizing: 'border-box',
        padding: '4px 10% 3px',
        textAlign: 'center',
        border: '1px solid #dadce0',
        fontSize: '11px',
        textTransform: 'lowercase',
        borderRadius: '5px',
        outline: 'none',
        fontFamily: 'Roboto,Arial,sans-serif',
      },
      input2: {
        height: '38px',
        width: '100%',
        border: '1px solid #dadce0',
        boxSizing: 'border-box',
        fontSize: '11px',
        textTransform: 'lowercase',
        borderRadius: '5px',
        outline: 'none',
        paddingLeft: '10px',
        fontFamily: 'Roboto,Arial,sans-serif',
      },
      label: {
        textAlign: 'center',
        fontSize: '12px',
        background: '#fff',
        position: 'absolute',
        textTransform: 'uppercase',
        color: '#3c4043',
        width: '35px',
        top: '-6px',
        left: '0',
        right: '0',
        marginLeft: 'auto',
        marginRight: 'auto',
        fontFamily: 'Roboto,Arial,sans-serif',
      },
      label2: {
        left: '10px',
        textAlign: 'center',
        fontSize: '12px',
        background: '#fff',
        position: 'absolute',
        textTransform: 'uppercase',
        color: '#3c4043',
        width: '32px',
        top: '-6px',
        fontFamily: 'Roboto,Arial,sans-serif',
      },
      single: {
        flexGrow: '1',
        margin: '0px 4.4px',
      },
    },
  });
  const rgbValue = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
  const hslValue = `${Math.round(hsl.h)}°, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%`;
  const hsvValue = `${Math.round(hsv.h)}°, ${Math.round(hsv.s * 100)}%, ${Math.round(hsv.v * 100)}%`;
  return _jsx('div', {
    style: styles.wrap,
    className: 'flexbox-fix',
    children: _jsxs('div', {
      style: styles.fields,
      children: [
        _jsx('div', {
          style: styles.double,
          children: _jsx(EditableInput, {
            style: { input: styles.input, label: styles.label },
            label: 'hex',
            value: hex,
            onChange: (value, event) => handleChange(value, event),
          }),
        }),
        _jsxs('div', {
          style: styles.column,
          children: [
            _jsx('div', {
              style: styles.single,
              children: _jsx(EditableInput, {
                style: { input: styles.input2, label: styles.label2 },
                label: 'rgb',
                value: rgbValue,
                onChange: (value, event) => handleChange(value, event),
              }),
            }),
            _jsx('div', {
              style: styles.single,
              children: _jsx(EditableInput, {
                style: { input: styles.input2, label: styles.label2 },
                label: 'hsv',
                value: hsvValue,
                onChange: (value, event) => handleChange(value, event),
              }),
            }),
            _jsx('div', {
              style: styles.single,
              children: _jsx(EditableInput, {
                style: { input: styles.input2, label: styles.label2 },
                label: 'hsl',
                value: hslValue,
                onChange: (value, event) => handleChange(value, event),
              }),
            }),
          ],
        }),
      ],
    }),
  });
};
export default GoogleFields;
