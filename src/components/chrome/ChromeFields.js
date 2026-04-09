import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import reactCSS from 'reactcss';
import * as color from '../../helpers/color';
import isUndefined from 'lodash/isUndefined';
import { EditableInput } from '../common';
import UnfoldMoreHorizontalIcon from '../common/icons/UnfoldMoreHorizontalIcon';
export const ChromeFields = (props) => {
  const [view, setView] = useState(() => (props.hsl.a !== 1 && props.view === 'hex' ? 'rgb' : props.view || 'hex'));
  const resolvedView = props.hsl.a !== 1 && view === 'hex' ? 'rgb' : view;
  const toggleViews = () => {
    if (resolvedView === 'hex') {
      setView('rgb');
    } else if (resolvedView === 'rgb') {
      setView('hsl');
    } else if (props.hsl.a === 1) {
      setView('hex');
    } else {
      setView('rgb');
    }
  };
  const handleChange = (data, event) => {
    if (data.hex) {
      if (color.isValidHex(data.hex)) {
        props.onChange(
          {
            hex: data.hex,
            source: 'hex',
          },
          event,
        );
      }
    } else if (data.r || data.g || data.b) {
      props.onChange(
        {
          r: data.r || props.rgb.r,
          g: data.g || props.rgb.g,
          b: data.b || props.rgb.b,
          source: 'rgb',
        },
        event,
      );
    } else if (!isUndefined(data.a)) {
      let alpha = Number(data.a);
      if (alpha < 0) {
        alpha = 0;
      } else if (alpha > 1) {
        alpha = 1;
      }
      props.onChange(
        {
          h: props.hsl.h,
          s: props.hsl.s,
          l: props.hsl.l,
          a: Math.round(alpha * 100) / 100,
          source: 'rgb',
        },
        event,
      );
    } else if (!isUndefined(data.h) || !isUndefined(data.s) || !isUndefined(data.l)) {
      const saturation = typeof data.s === 'string' && data.s.indexOf('%') > -1 ? data.s.replace('%', '') : data.s;
      const lightness = typeof data.l === 'string' && data.l.indexOf('%') > -1 ? data.l.replace('%', '') : data.l;
      let nextSaturation = Number(!isUndefined(saturation) ? saturation : props.hsl.s);
      let nextLightness = Number(!isUndefined(lightness) ? lightness : props.hsl.l);
      if (nextSaturation === 1) {
        nextSaturation = 0.01;
      } else if (nextLightness === 1) {
        nextLightness = 0.01;
      }
      props.onChange(
        {
          h: Number(!isUndefined(data.h) ? data.h : props.hsl.h),
          s: nextSaturation,
          l: nextLightness,
          source: 'hsl',
        },
        event,
      );
    }
  };
  const styles = reactCSS(
    {
      default: {
        wrap: {
          paddingTop: '16px',
          display: 'flex',
        },
        fields: {
          flex: '1',
          display: 'flex',
          marginLeft: '-6px',
        },
        field: {
          paddingLeft: '6px',
          width: '100%',
        },
        alpha: {
          paddingLeft: '6px',
          width: '100%',
        },
        toggle: {
          width: '32px',
          textAlign: 'right',
          position: 'relative',
        },
        icon: {
          marginRight: '-4px',
          marginTop: '12px',
          cursor: 'pointer',
          position: 'relative',
        },
        input: {
          fontSize: '11px',
          color: '#333',
          width: '100%',
          borderRadius: '2px',
          border: 'none',
          boxShadow: 'inset 0 0 0 1px #dadada',
          height: '21px',
          textAlign: 'center',
        },
        label: {
          textTransform: 'uppercase',
          fontSize: '11px',
          lineHeight: '11px',
          color: '#969696',
          textAlign: 'center',
          display: 'block',
          marginTop: '12px',
        },
        svg: {
          fill: '#333',
          width: '24px',
          height: '24px',
          border: '1px transparent solid',
          borderRadius: '5px',
        },
      },
      disableAlpha: {
        alpha: {
          display: 'none',
        },
      },
    },
    props,
    { view: resolvedView },
  );
  let fields;
  if (resolvedView === 'hex') {
    fields = _jsx('div', {
      style: styles.fields,
      className: 'flexbox-fix',
      children: _jsx('div', {
        style: styles.field,
        children: _jsx(EditableInput, {
          style: { input: styles.input, label: styles.label },
          label: 'hex',
          value: props.hex,
          onChange: (value, event) => handleChange(value, event),
        }),
      }),
    });
  } else if (resolvedView === 'rgb') {
    fields = _jsxs('div', {
      style: styles.fields,
      className: 'flexbox-fix',
      children: [
        _jsx('div', {
          style: styles.field,
          children: _jsx(EditableInput, {
            style: { input: styles.input, label: styles.label },
            label: 'r',
            value: props.rgb.r,
            onChange: (value, event) => handleChange(value, event),
          }),
        }),
        _jsx('div', {
          style: styles.field,
          children: _jsx(EditableInput, {
            style: { input: styles.input, label: styles.label },
            label: 'g',
            value: props.rgb.g,
            onChange: (value, event) => handleChange(value, event),
          }),
        }),
        _jsx('div', {
          style: styles.field,
          children: _jsx(EditableInput, {
            style: { input: styles.input, label: styles.label },
            label: 'b',
            value: props.rgb.b,
            onChange: (value, event) => handleChange(value, event),
          }),
        }),
        _jsx('div', {
          style: styles.alpha,
          children: _jsx(EditableInput, {
            style: { input: styles.input, label: styles.label },
            label: 'a',
            value: props.rgb.a,
            arrowOffset: 0.01,
            onChange: (value, event) => handleChange(value, event),
          }),
        }),
      ],
    });
  } else {
    fields = _jsxs('div', {
      style: styles.fields,
      className: 'flexbox-fix',
      children: [
        _jsx('div', {
          style: styles.field,
          children: _jsx(EditableInput, {
            style: { input: styles.input, label: styles.label },
            label: 'h',
            value: Math.round(props.hsl.h),
            onChange: (value, event) => handleChange(value, event),
          }),
        }),
        _jsx('div', {
          style: styles.field,
          children: _jsx(EditableInput, {
            style: { input: styles.input, label: styles.label },
            label: 's',
            value: `${Math.round(props.hsl.s * 100)}%`,
            onChange: (value, event) => handleChange(value, event),
          }),
        }),
        _jsx('div', {
          style: styles.field,
          children: _jsx(EditableInput, {
            style: { input: styles.input, label: styles.label },
            label: 'l',
            value: `${Math.round(props.hsl.l * 100)}%`,
            onChange: (value, event) => handleChange(value, event),
          }),
        }),
        _jsx('div', {
          style: styles.alpha,
          children: _jsx(EditableInput, {
            style: { input: styles.input, label: styles.label },
            label: 'a',
            value: props.hsl.a,
            arrowOffset: 0.01,
            onChange: (value, event) => handleChange(value, event),
          }),
        }),
      ],
    });
  }
  return _jsxs('div', {
    style: styles.wrap,
    className: 'flexbox-fix',
    children: [
      fields,
      _jsx('div', {
        style: styles.toggle,
        children: _jsx('div', {
          style: styles.icon,
          onClick: toggleViews,
          children: _jsx(UnfoldMoreHorizontalIcon, { style: styles.svg }),
        }),
      }),
    ],
  });
};
export default ChromeFields;
