import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import reactCSS from 'reactcss';
import map from 'lodash/map';
import merge from 'lodash/merge';
import { ColorWrap } from '../common';
import { getPickerRootProps } from '../common/styleArchitecture';
import GithubSwatch from './GithubSwatch';
const DEFAULT_GITHUB_COLORS = [
  '#B80000',
  '#DB3E00',
  '#FCCB00',
  '#008B02',
  '#006B76',
  '#1273DE',
  '#004DCF',
  '#5300EB',
  '#EB9694',
  '#FAD0C3',
  '#FEF3BD',
  '#C1E1C5',
  '#BEDADC',
  '#C4DEF6',
  '#BED3F3',
  '#D4C4FB',
];
export const Github = ({
  width = 200,
  colors = DEFAULT_GITHUB_COLORS,
  onChange,
  onSwatchHover,
  triangle = 'top-left',
  styles: passedStyles = {},
  className = '',
  classNames,
  theme,
}) => {
  const styles = reactCSS(
    merge(
      {
        default: {
          card: {
            width,
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.2)',
            boxShadow: '0 3px 12px rgba(0,0,0,0.15)',
            borderRadius: '4px',
            position: 'relative',
            padding: '5px',
            display: 'flex',
            flexWrap: 'wrap',
          },
          triangle: {
            position: 'absolute',
            border: '7px solid transparent',
            borderBottomColor: '#fff',
          },
          triangleShadow: {
            position: 'absolute',
            border: '8px solid transparent',
            borderBottomColor: 'rgba(0,0,0,0.15)',
          },
        },
        'hide-triangle': {
          triangle: {
            display: 'none',
          },
          triangleShadow: {
            display: 'none',
          },
        },
        'top-left-triangle': {
          triangle: {
            top: '-14px',
            left: '10px',
          },
          triangleShadow: {
            top: '-16px',
            left: '9px',
          },
        },
        'top-right-triangle': {
          triangle: {
            top: '-14px',
            right: '10px',
          },
          triangleShadow: {
            top: '-16px',
            right: '9px',
          },
        },
        'bottom-left-triangle': {
          triangle: {
            top: '35px',
            left: '10px',
            transform: 'rotate(180deg)',
          },
          triangleShadow: {
            top: '37px',
            left: '9px',
            transform: 'rotate(180deg)',
          },
        },
        'bottom-right-triangle': {
          triangle: {
            top: '35px',
            right: '10px',
            transform: 'rotate(180deg)',
          },
          triangleShadow: {
            top: '37px',
            right: '9px',
            transform: 'rotate(180deg)',
          },
        },
      },
      passedStyles,
    ),
    {
      'hide-triangle': triangle === 'hide',
      'top-left-triangle': triangle === 'top-left',
      'top-right-triangle': triangle === 'top-right',
      'bottom-left-triangle': triangle === 'bottom-left',
      'bottom-right-triangle': triangle === 'bottom-right',
    },
  );
  return _jsxs(
    'div',
    Object.assign(
      { style: styles.card },
      getPickerRootProps({
        block: 'github',
        theme,
        className: `github-picker ${className}`,
        classNames,
      }),
      {
        children: [
          _jsx('div', { style: styles.triangleShadow }),
          _jsx('div', { style: styles.triangle }),
          map(colors, (colorValue) =>
            _jsx(
              GithubSwatch,
              {
                color: colorValue,
                onClick: (hexCode, event) => onChange({ hex: hexCode, source: 'hex' }, event),
                onSwatchHover: onSwatchHover,
              },
              colorValue,
            ),
          ),
        ],
      },
    ),
  );
};
export default ColorWrap(Github);
