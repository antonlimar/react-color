import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import reactCSS from 'reactcss';
import merge from 'lodash/merge';
import * as color from '../../helpers/color';
import { ColorWrap, EditableInput, Raised } from '../common';
import { getPickerRootProps } from '../common/styleArchitecture';
const handleMaterialChange = (onChange, rgb, data, event) => {
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
        source: 'rgb',
      },
      event,
    );
  }
};
export const Material = ({ onChange, hex, rgb, styles: passedStyles = {}, className = '', classNames, theme }) => {
  const styles = reactCSS(
    merge(
      {
        default: {
          material: {
            width: '98px',
            height: '98px',
            padding: '16px',
            fontFamily: 'Roboto',
          },
          HEXwrap: {
            position: 'relative',
          },
          HEXinput: {
            width: '100%',
            marginTop: '12px',
            fontSize: '15px',
            color: '#333',
            padding: '0px',
            border: '0px',
            borderBottom: `2px solid ${hex}`,
            outline: 'none',
            height: '30px',
          },
          HEXlabel: {
            position: 'absolute',
            top: '0px',
            left: '0px',
            fontSize: '11px',
            color: '#999999',
            textTransform: 'capitalize',
          },
          Hex: {
            style: {},
          },
          RGBwrap: {
            position: 'relative',
          },
          RGBinput: {
            width: '100%',
            marginTop: '12px',
            fontSize: '15px',
            color: '#333',
            padding: '0px',
            border: '0px',
            borderBottom: '1px solid #eee',
            outline: 'none',
            height: '30px',
          },
          RGBlabel: {
            position: 'absolute',
            top: '0px',
            left: '0px',
            fontSize: '11px',
            color: '#999999',
            textTransform: 'capitalize',
          },
          split: {
            display: 'flex',
            marginRight: '-10px',
            paddingTop: '11px',
          },
          third: {
            flex: '1',
            paddingRight: '10px',
          },
        },
      },
      passedStyles,
    ),
  );
  return _jsx(Raised, {
    styles: passedStyles,
    children: _jsxs(
      'div',
      Object.assign(
        { style: styles.material },
        getPickerRootProps({
          block: 'material',
          theme,
          className: `material-picker ${className}`,
          classNames,
        }),
        {
          children: [
            _jsx(EditableInput, {
              style: { wrap: styles.HEXwrap, input: styles.HEXinput, label: styles.HEXlabel },
              label: 'hex',
              value: hex,
              onChange: (value, event) => handleMaterialChange(onChange, rgb, value, event),
            }),
            _jsxs('div', {
              style: styles.split,
              className: 'flexbox-fix',
              children: [
                _jsx('div', {
                  style: styles.third,
                  children: _jsx(EditableInput, {
                    style: { wrap: styles.RGBwrap, input: styles.RGBinput, label: styles.RGBlabel },
                    label: 'r',
                    value: rgb.r,
                    onChange: (value, event) => handleMaterialChange(onChange, rgb, value, event),
                  }),
                }),
                _jsx('div', {
                  style: styles.third,
                  children: _jsx(EditableInput, {
                    style: { wrap: styles.RGBwrap, input: styles.RGBinput, label: styles.RGBlabel },
                    label: 'g',
                    value: rgb.g,
                    onChange: (value, event) => handleMaterialChange(onChange, rgb, value, event),
                  }),
                }),
                _jsx('div', {
                  style: styles.third,
                  children: _jsx(EditableInput, {
                    style: { wrap: styles.RGBwrap, input: styles.RGBinput, label: styles.RGBlabel },
                    label: 'b',
                    value: rgb.b,
                    onChange: (value, event) => handleMaterialChange(onChange, rgb, value, event),
                  }),
                }),
              ],
            }),
          ],
        },
      ),
    ),
  });
};
export default ColorWrap(Material);
