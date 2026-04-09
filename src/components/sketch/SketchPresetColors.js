import { jsx as _jsx } from 'react/jsx-runtime';
import reactCSS from 'reactcss';
import { Swatch } from '../common';
export const SketchPresetColors = ({ colors, onClick = () => {}, onSwatchHover }) => {
  const styles = reactCSS(
    {
      default: {
        colors: {
          margin: '0 -10px',
          padding: '10px 0 0 10px',
          borderTop: '1px solid #eee',
          display: 'flex',
          flexWrap: 'wrap',
          position: 'relative',
        },
        swatchWrap: {
          width: '16px',
          height: '16px',
          margin: '0 10px 10px 0',
        },
        swatch: {
          borderRadius: '3px',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.15)',
        },
      },
      'no-presets': {
        colors: {
          display: 'none',
        },
      },
    },
    {
      'no-presets': !colors || !colors.length,
    },
  );
  const handleClick = (hex, event) => {
    onClick(
      {
        hex,
        source: 'hex',
      },
      event,
    );
  };
  return _jsx('div', {
    style: styles.colors,
    className: 'flexbox-fix',
    children: colors.map((colorObjOrString) => {
      const colorValue = typeof colorObjOrString === 'string' ? { color: colorObjOrString } : colorObjOrString;
      const key = `${colorValue.color}${colorValue.title || ''}`;
      return _jsx(
        'div',
        {
          style: styles.swatchWrap,
          children: _jsx(
            Swatch,
            Object.assign({}, colorValue, {
              style: styles.swatch,
              onClick: handleClick,
              onHover: onSwatchHover,
              focusStyle: {
                boxShadow: `inset 0 0 0 1px rgba(0,0,0,.15), 0 0 4px ${colorValue.color}`,
              },
            }),
          ),
        },
        key,
      );
    }),
  });
};
export default SketchPresetColors;
