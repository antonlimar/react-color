import { jsx as _jsx } from 'react/jsx-runtime';
import { useEffect, useRef, useState } from 'react';
import debounce from 'lodash/debounce';
import * as color from '../../helpers/color';
const defaultColor = {
  h: 250,
  s: 0.5,
  l: 0.2,
  a: 1,
};
const getColorWithDefault = (colorProp) => (colorProp !== null && colorProp !== void 0 ? colorProp : defaultColor);
const getColorPropKey = (colorProp) => {
  const value = getColorWithDefault(colorProp);
  return typeof value === 'string' ? value : JSON.stringify(value);
};
const getOldHue = (data, oldHue) => {
  if (typeof data === 'object' && data !== null && 'h' in data && typeof data.h === 'number') {
    return data.h;
  }
  return oldHue;
};
export const ColorWrap = (Picker) => {
  const ColorPicker = (props) => {
    const { onChange, onChangeComplete, onSwatchHover } = props;
    const [state, setState] = useState(() => {
      const resolvedColor = getColorWithDefault(props.color);
      return Object.assign(Object.assign({}, color.toState(resolvedColor, 0)), {
        colorPropKey: getColorPropKey(resolvedColor),
      });
    });
    const debounceRef = useRef(
      debounce((fn, data, event) => {
        fn(data, event);
      }, 100),
    );
    useEffect(() => {
      const debouncedChange = debounceRef.current;
      return () => {
        debouncedChange.cancel();
      };
    }, []);
    const nextColorPropKey = getColorPropKey(props.color);
    const currentState =
      nextColorPropKey === state.colorPropKey
        ? state
        : Object.assign(Object.assign({}, color.toState(getColorWithDefault(props.color), state.oldHue)), {
            colorPropKey: nextColorPropKey,
          });
    const handleChange = (data, event) => {
      const isValidColor = color.simpleCheckForValidColor(data);
      if (isValidColor) {
        const colors = color.toState(data, getOldHue(data, currentState.oldHue));
        setState(Object.assign(Object.assign({}, colors), { colorPropKey: currentState.colorPropKey }));
        onChangeComplete && debounceRef.current(onChangeComplete, colors, event);
        onChange && onChange(colors, event);
      }
    };
    const handleSwatchHover = (data, event) => {
      const isValidColor = color.simpleCheckForValidColor(data);
      if (isValidColor) {
        const colors = color.toState(data, getOldHue(data, currentState.oldHue));
        onSwatchHover && onSwatchHover(colors, event);
      }
    };
    const optionalEvents = {};
    const pickerProps = Object.assign(Object.assign({}, props), { color: getColorWithDefault(props.color) });
    if (onSwatchHover) {
      optionalEvents.onSwatchHover = handleSwatchHover;
    }
    return _jsx(Picker, Object.assign({}, pickerProps, currentState, { onChange: handleChange }, optionalEvents));
  };
  return ColorPicker;
};
export default ColorWrap;
