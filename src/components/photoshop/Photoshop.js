import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import reactCSS from 'reactcss';
import merge from 'lodash/merge';
import { ColorWrap, Saturation, Hue } from '../common';
import { getPickerRootProps } from '../common/styleArchitecture';
import PhotoshopFields from './PhotoshopFields';
import PhotoshopPointerCircle from './PhotoshopPointerCircle';
import PhotoshopPointer from './PhotoshopPointer';
import PhotoshopButton from './PhotoshopButton';
import PhotoshopPreviews from './PhotoshopPreviews';
const defaultHeader = 'Color Picker';
const defaultStyles = {};
export const Photoshop = (props) => {
  var _a, _b;
  const [currentColor] = useState(props.hex);
  const resolvedProps = Object.assign(Object.assign({}, props), {
    header: (_a = props.header) !== null && _a !== void 0 ? _a : defaultHeader,
    styles: (_b = props.styles) !== null && _b !== void 0 ? _b : defaultStyles,
  });
  const { styles: passedStyles, className = '', classNames, theme } = resolvedProps;
  const styles = reactCSS(
    merge(
      {
        default: {
          picker: {
            background: '#DCDCDC',
            borderRadius: '4px',
            boxShadow: '0 0 0 1px rgba(0,0,0,.25), 0 8px 16px rgba(0,0,0,.15)',
            boxSizing: 'initial',
            width: '513px',
          },
          head: {
            backgroundImage: 'linear-gradient(-180deg, #F0F0F0 0%, #D4D4D4 100%)',
            borderBottom: '1px solid #B1B1B1',
            boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,.2), inset 0 -1px 0 0 rgba(0,0,0,.02)',
            height: '23px',
            lineHeight: '24px',
            borderRadius: '4px 4px 0 0',
            fontSize: '13px',
            color: '#4D4D4D',
            textAlign: 'center',
          },
          body: {
            padding: '15px 15px 0',
            display: 'flex',
          },
          saturation: {
            width: '256px',
            height: '256px',
            position: 'relative',
            border: '2px solid #B3B3B3',
            borderBottom: '2px solid #F0F0F0',
            overflow: 'hidden',
          },
          hue: {
            position: 'relative',
            height: '256px',
            width: '19px',
            marginLeft: '10px',
            border: '2px solid #B3B3B3',
            borderBottom: '2px solid #F0F0F0',
          },
          controls: {
            width: '180px',
            marginLeft: '10px',
          },
          top: {
            display: 'flex',
          },
          previews: {
            width: '60px',
          },
          actions: {
            flex: '1',
            marginLeft: '20px',
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
        block: 'photoshop',
        theme,
        className: `photoshop-picker ${className}`,
        classNames,
      }),
      {
        children: [
          _jsx('div', { style: styles.head, children: resolvedProps.header }),
          _jsxs('div', {
            style: styles.body,
            className: 'flexbox-fix',
            children: [
              _jsx('div', {
                style: styles.saturation,
                children: _jsx(Saturation, {
                  hsl: resolvedProps.hsl,
                  hsv: resolvedProps.hsv,
                  pointer: PhotoshopPointerCircle,
                  onChange: resolvedProps.onChange,
                }),
              }),
              _jsx('div', {
                style: styles.hue,
                children: _jsx(Hue, {
                  direction: 'vertical',
                  hsl: resolvedProps.hsl,
                  pointer: PhotoshopPointer,
                  onChange: resolvedProps.onChange,
                }),
              }),
              _jsx('div', {
                style: styles.controls,
                children: _jsxs('div', {
                  style: styles.top,
                  className: 'flexbox-fix',
                  children: [
                    _jsx('div', {
                      style: styles.previews,
                      children: _jsx(PhotoshopPreviews, { rgb: resolvedProps.rgb, currentColor: currentColor }),
                    }),
                    _jsxs('div', {
                      style: styles.actions,
                      children: [
                        _jsx(PhotoshopButton, {
                          label: 'OK',
                          onClick: () => {
                            var _a;
                            return (_a = resolvedProps.onAccept) === null || _a === void 0
                              ? void 0
                              : _a.call(resolvedProps, resolvedProps, undefined);
                          },
                          active: true,
                        }),
                        _jsx(PhotoshopButton, { label: 'Cancel', onClick: resolvedProps.onCancel }),
                        _jsx(PhotoshopFields, {
                          onChange: resolvedProps.onChange,
                          rgb: resolvedProps.rgb,
                          hsv: resolvedProps.hsv,
                          hex: resolvedProps.hex,
                        }),
                      ],
                    }),
                  ],
                }),
              }),
            ],
          }),
        ],
      },
    ),
  );
};
export default ColorWrap(Photoshop);
