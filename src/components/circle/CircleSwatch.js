import { jsx as _jsx } from 'react/jsx-runtime';
import reactCSS, { handleHover } from 'reactcss';
import { Swatch } from '../common';
export const CircleSwatch = ({ color, onClick, onSwatchHover, hover, active, circleSize = 28, circleSpacing = 14 }) => {
  const styles = reactCSS(
    {
      default: {
        swatch: {
          width: circleSize,
          height: circleSize,
          marginRight: circleSpacing,
          marginBottom: circleSpacing,
          transform: 'scale(1)',
          transition: '100ms transform ease',
        },
        Swatch: {
          borderRadius: '50%',
          background: 'transparent',
          boxShadow: `inset 0 0 0 ${circleSize / 2 + 1}px ${color}`,
          transition: '100ms box-shadow ease',
        },
      },
      hover: {
        swatch: {
          transform: 'scale(1.2)',
        },
      },
      active: {
        Swatch: {
          boxShadow: `inset 0 0 0 3px ${color}`,
        },
      },
    },
    { hover, active },
  );
  const circleStyle = styles.Swatch || {};
  return _jsx('div', {
    style: styles.swatch,
    children: _jsx(Swatch, {
      style: circleStyle,
      color: color,
      onClick: onClick,
      onHover: onSwatchHover,
      focusStyle: { boxShadow: `${circleStyle.boxShadow || 'none'}, 0 0 5px ${color}` },
    }),
  });
};
export default handleHover(CircleSwatch);
