import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import reactCSS from 'reactcss';
import merge from 'lodash/merge';
import { ColorWrap, Saturation, Hue, Alpha, Checkboard } from '../common';
import { getPickerRootProps } from '../common/styleArchitecture';
import ChromeFields from './ChromeFields';
import ChromePointer from './ChromePointer';
import ChromePointerCircle from './ChromePointerCircle';
export const Chrome = ({
  width = 225,
  onChange,
  disableAlpha = false,
  rgb,
  hsl,
  hsv,
  hex,
  renderers,
  styles: passedStyles = {},
  className = '',
  classNames,
  theme,
  defaultView,
}) => {
  const styles = reactCSS(
    merge(
      {
        default: {
          picker: {
            width,
            background: '#fff',
            borderRadius: '2px',
            boxShadow: '0 0 2px rgba(0,0,0,.3), 0 4px 8px rgba(0,0,0,.3)',
            boxSizing: 'initial',
            fontFamily: 'Menlo',
          },
          saturation: {
            width: '100%',
            paddingBottom: '55%',
            position: 'relative',
            borderRadius: '2px 2px 0 0',
            overflow: 'hidden',
          },
          Saturation: {
            radius: '2px 2px 0 0',
          },
          body: {
            padding: '16px 16px 12px',
          },
          controls: {
            display: 'flex',
          },
          color: {
            width: '32px',
          },
          swatch: {
            marginTop: '6px',
            width: '16px',
            height: '16px',
            borderRadius: '8px',
            position: 'relative',
            overflow: 'hidden',
          },
          active: {
            absolute: '0px 0px 0px 0px',
            borderRadius: '8px',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.1)',
            background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`,
            zIndex: '2',
          },
          toggles: {
            flex: '1',
          },
          hue: {
            height: '10px',
            position: 'relative',
            marginBottom: '8px',
          },
          Hue: {
            radius: '2px',
          },
          alpha: {
            height: '10px',
            position: 'relative',
          },
          Alpha: {
            radius: '2px',
          },
        },
        disableAlpha: {
          color: {
            width: '22px',
          },
          alpha: {
            display: 'none',
          },
          hue: {
            marginBottom: '0px',
          },
          swatch: {
            width: '10px',
            height: '10px',
            marginTop: '0px',
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
        block: 'chrome',
        theme,
        modifiers: [disableAlpha && 'disabled-alpha'],
        className: `chrome-picker ${className}`,
        classNames,
      }),
      {
        children: [
          _jsx('div', {
            style: styles.saturation,
            children: _jsx(Saturation, {
              style: styles.Saturation,
              hsl: hsl,
              hsv: hsv,
              pointer: ChromePointerCircle,
              onChange: onChange,
            }),
          }),
          _jsxs('div', {
            style: styles.body,
            children: [
              _jsxs('div', {
                style: styles.controls,
                className: 'flexbox-fix',
                children: [
                  _jsx('div', {
                    style: styles.color,
                    children: _jsxs('div', {
                      style: styles.swatch,
                      children: [_jsx('div', { style: styles.active }), _jsx(Checkboard, { renderers: renderers })],
                    }),
                  }),
                  _jsxs('div', {
                    style: styles.toggles,
                    children: [
                      _jsx('div', {
                        style: styles.hue,
                        children: _jsx(Hue, {
                          style: styles.Hue,
                          hsl: hsl,
                          pointer: ChromePointer,
                          onChange: onChange,
                        }),
                      }),
                      _jsx('div', {
                        style: styles.alpha,
                        children: _jsx(Alpha, {
                          style: styles.Alpha,
                          rgb: rgb,
                          hsl: hsl,
                          pointer: ChromePointer,
                          renderers: renderers,
                          onChange: onChange,
                        }),
                      }),
                    ],
                  }),
                ],
              }),
              _jsx(ChromeFields, {
                rgb: rgb,
                hsl: hsl,
                hex: hex,
                view: defaultView,
                onChange: onChange,
                disableAlpha: disableAlpha,
              }),
            ],
          }),
        ],
      },
    ),
  );
};
export default ColorWrap(Chrome);
