import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import reactCSS from 'reactcss';
import merge from 'lodash/merge';
import { ColorWrap, Saturation, Hue } from '../common';
import { getPickerRootProps } from '../common/styleArchitecture';
import GooglePointerCircle from './GooglePointerCircle';
import GooglePointer from './GooglePointer';
import GoogleFields from './GoogleFields';
export const Google = ({
  width = 652,
  onChange,
  rgb,
  hsl,
  hsv,
  hex,
  header = 'Color picker',
  styles: passedStyles = {},
  className = '',
  classNames,
  theme,
}) => {
  const styles = reactCSS(
    merge(
      {
        default: {
          picker: {
            width,
            background: '#fff',
            border: '1px solid #dfe1e5',
            boxSizing: 'initial',
            display: 'flex',
            flexWrap: 'wrap',
            borderRadius: '8px 8px 0px 0px',
          },
          head: {
            height: '57px',
            width: '100%',
            paddingTop: '16px',
            paddingBottom: '16px',
            paddingLeft: '16px',
            fontSize: '20px',
            boxSizing: 'border-box',
            fontFamily: 'Roboto-Regular,HelveticaNeue,Arial,sans-serif',
          },
          saturation: {
            width: '70%',
            padding: '0px',
            position: 'relative',
            overflow: 'hidden',
          },
          swatch: {
            width: '30%',
            height: '228px',
            padding: '0px',
            background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
            position: 'relative',
            overflow: 'hidden',
          },
          body: {
            margin: 'auto',
            width: '95%',
          },
          controls: {
            display: 'flex',
            boxSizing: 'border-box',
            height: '52px',
            paddingTop: '22px',
          },
          color: {
            width: '32px',
          },
          hue: {
            height: '8px',
            position: 'relative',
            margin: '0px 16px 0px 16px',
            width: '100%',
          },
          Hue: {
            radius: '2px',
          },
        },
      },
      passedStyles,
    ),
  );
  return _jsxs(
    'div',
    Object.assign(
      { style: styles.picker },
      getPickerRootProps({
        block: 'google',
        theme,
        className: `google-picker ${className}`,
        classNames,
      }),
      {
        children: [
          _jsx('div', { style: styles.head, children: header }),
          _jsx('div', { style: styles.swatch }),
          _jsx('div', {
            style: styles.saturation,
            children: _jsx(Saturation, { hsl: hsl, hsv: hsv, pointer: GooglePointerCircle, onChange: onChange }),
          }),
          _jsxs('div', {
            style: styles.body,
            children: [
              _jsx('div', {
                style: styles.controls,
                className: 'flexbox-fix',
                children: _jsx('div', {
                  style: styles.hue,
                  children: _jsx(Hue, {
                    style: styles.Hue,
                    hsl: hsl,
                    radius: '4px',
                    pointer: GooglePointer,
                    onChange: onChange,
                  }),
                }),
              }),
              _jsx(GoogleFields, { rgb: rgb, hsl: hsl, hex: hex, hsv: hsv, onChange: onChange }),
            ],
          }),
        ],
      },
    ),
  );
};
export default ColorWrap(Google);
