import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import reactCSS from 'reactcss';
import map from 'lodash/map';
import merge from 'lodash/merge';
import * as color from '../../helpers/color';
import { ColorWrap, Raised } from '../common';
import { getPickerRootProps } from '../common/styleArchitecture';
import CompactColor from './CompactColor';
import CompactFields from './CompactFields';
const handleCompactChange = (onChange, data, event) => {
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
  } else {
    onChange(data, event);
  }
};
const DEFAULT_COMPACT_COLORS = [
  '#4D4D4D',
  '#999999',
  '#FFFFFF',
  '#F44E3B',
  '#FE9200',
  '#FCDC00',
  '#DBDF00',
  '#A4DD00',
  '#68CCCA',
  '#73D8FF',
  '#AEA1FF',
  '#FDA1FF',
  '#333333',
  '#808080',
  '#cccccc',
  '#D33115',
  '#E27300',
  '#FCC400',
  '#B0BC00',
  '#68BC00',
  '#16A5A5',
  '#009CE0',
  '#7B64FF',
  '#FA28FF',
  '#000000',
  '#666666',
  '#B3B3B3',
  '#9F0500',
  '#C45100',
  '#FB9E00',
  '#808900',
  '#194D33',
  '#0C797D',
  '#0062B1',
  '#653294',
  '#AB149E',
];
export const Compact = ({
  onChange,
  onSwatchHover,
  colors = DEFAULT_COMPACT_COLORS,
  hex,
  rgb,
  styles: passedStyles = {},
  className = '',
  classNames,
  theme,
}) => {
  const styles = reactCSS(
    merge(
      {
        default: {
          Compact: {
            background: '#f6f6f6',
            radius: '4px',
          },
          compact: {
            paddingTop: '5px',
            paddingLeft: '5px',
            boxSizing: 'initial',
            width: '240px',
          },
          clear: {
            clear: 'both',
          },
        },
      },
      passedStyles,
    ),
  );
  return _jsx(Raised, {
    style: styles.Compact,
    styles: passedStyles,
    children: _jsxs(
      'div',
      Object.assign(
        { style: styles.compact },
        getPickerRootProps({
          block: 'compact',
          theme,
          className: `compact-picker ${className}`,
          classNames,
        }),
        {
          children: [
            _jsxs('div', {
              children: [
                map(colors, (colorValue) =>
                  _jsx(
                    CompactColor,
                    {
                      color: colorValue,
                      active: colorValue.toLowerCase() === hex,
                      onClick: (swatchColor, event) => handleCompactChange(onChange, { hex: swatchColor }, event),
                      onSwatchHover: onSwatchHover,
                    },
                    colorValue,
                  ),
                ),
                _jsx('div', { style: styles.clear }),
              ],
            }),
            _jsx(CompactFields, {
              hex: hex,
              rgb: rgb,
              onChange: (data, event) => handleCompactChange(onChange, data, event),
            }),
          ],
        },
      ),
    ),
  });
};
export default ColorWrap(Compact);
