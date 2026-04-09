import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import reactCSS from 'reactcss';
import merge from 'lodash/merge';
import * as color from '../../helpers/color';
import { ColorWrap, EditableInput, Checkboard } from '../common';
import { getPickerRootProps } from '../common/styleArchitecture';
import BlockSwatches from './BlockSwatches';
const handleHexChange = (onChange, hexCode, event) => {
  if (color.isValidHex(hexCode)) {
    onChange(
      {
        hex: hexCode,
        source: 'hex',
      },
      event,
    );
  }
};
export const Block = ({
  onChange,
  onSwatchHover,
  hex,
  colors = ['#D9E3F0', '#F47373', '#697689', '#37D67A', '#2CCCE4', '#555555', '#dce775', '#ff8a65', '#ba68c8'],
  width = 170,
  triangle = 'top',
  styles: passedStyles = {},
  className = '',
  classNames,
  theme,
}) => {
  const transparent = hex === 'transparent';
  const styles = reactCSS(
    merge(
      {
        default: {
          card: {
            width,
            background: '#fff',
            boxShadow: '0 1px rgba(0,0,0,.1)',
            borderRadius: '6px',
            position: 'relative',
          },
          head: {
            height: '110px',
            background: hex,
            borderRadius: '6px 6px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          },
          body: {
            padding: '10px',
          },
          label: {
            fontSize: '18px',
            color: color.getContrastingColor(hex),
            position: 'relative',
          },
          triangle: {
            width: '0px',
            height: '0px',
            borderStyle: 'solid',
            borderWidth: '0 10px 10px 10px',
            borderColor: `transparent transparent ${hex} transparent`,
            position: 'absolute',
            top: '-10px',
            left: '50%',
            marginLeft: '-10px',
          },
          input: {
            width: '100%',
            fontSize: '12px',
            color: '#666',
            border: '0px',
            outline: 'none',
            height: '22px',
            boxShadow: 'inset 0 0 0 1px #ddd',
            borderRadius: '4px',
            padding: '0 7px',
            boxSizing: 'border-box',
          },
        },
        'hide-triangle': {
          triangle: {
            display: 'none',
          },
        },
      },
      passedStyles,
    ),
    { 'hide-triangle': triangle === 'hide' },
  );
  return _jsxs(
    'div',
    Object.assign(
      { style: styles.card },
      getPickerRootProps({
        block: 'block',
        theme,
        className: `block-picker ${className}`,
        classNames,
      }),
      {
        children: [
          _jsx('div', { style: styles.triangle }),
          _jsxs('div', {
            style: styles.head,
            children: [
              transparent ? _jsx(Checkboard, { borderRadius: '6px 6px 0 0' }) : null,
              _jsx('div', { style: styles.label, children: hex }),
            ],
          }),
          _jsxs('div', {
            style: styles.body,
            children: [
              _jsx(BlockSwatches, {
                colors: colors,
                onClick: (hexCode, event) => handleHexChange(onChange, hexCode, event),
                onSwatchHover: onSwatchHover,
              }),
              _jsx(EditableInput, {
                style: { input: styles.input },
                value: hex,
                onChange: (value, event) => handleHexChange(onChange, String(value), event),
              }),
            ],
          }),
        ],
      },
    ),
  );
};
export default ColorWrap(Block);
