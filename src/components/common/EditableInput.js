import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useCallback, useEffect, useRef, useState } from 'react';
import reactCSS from 'reactcss';
const DEFAULT_ARROW_OFFSET = 1;
const UP_KEY_CODE = 38;
const DOWN_KEY_CODE = 40;
const VALID_KEY_CODES = [UP_KEY_CODE, DOWN_KEY_CODE];
const isValidKeyCode = (keyCode) => VALID_KEY_CODES.indexOf(keyCode) > -1;
const getNumberValue = (value) => Number(String(value).replace(/%/g, ''));
let idCounter = 1;
export function EditableInput(props) {
  const { arrowOffset, dragLabel, dragMax, hideLabel, label, onChange, placeholder, style, value } = props;
  const [state, setState] = useState(() => {
    const initialValue = String(value).toUpperCase();
    return {
      value: initialValue,
      blurValue: initialValue,
    };
  });
  const inputRef = useRef(null);
  const [inputId] = useState(() => `rc-editable-input-${idCounter++}`);
  const [isDragging, setIsDragging] = useState(false);
  const prevPropsValueRef = useRef(props.value);
  const prevStateValueRef = useRef(state.value);
  const getValueObjectWithLabel = useCallback(
    (value) => ({
      [label]: value,
    }),
    [label],
  );
  const setUpdatedValue = useCallback(
    (value, event) => {
      const onChangeValue = label ? getValueObjectWithLabel(value) : value;
      onChange === null || onChange === void 0 ? void 0 : onChange(onChangeValue, event);
      setState((currentState) => Object.assign(Object.assign({}, currentState), { value }));
    },
    [getValueObjectWithLabel, label, onChange],
  );
  const handleDrag = useCallback(
    (event) => {
      if (dragLabel) {
        const newValue = Math.round(value + event.movementX);
        if (newValue >= 0 && newValue <= dragMax) {
          onChange === null || onChange === void 0 ? void 0 : onChange(getValueObjectWithLabel(newValue), event);
        }
      }
    },
    [dragLabel, dragMax, getValueObjectWithLabel, onChange, value],
  );
  const handleMouseDown = useCallback(
    (event) => {
      if (dragLabel) {
        event.preventDefault();
        handleDrag(event.nativeEvent);
        setIsDragging(true);
      }
    },
    [dragLabel, handleDrag],
  );
  const handleBlur = useCallback(() => {
    setState((currentState) =>
      currentState.blurValue ? { value: currentState.blurValue, blurValue: null } : currentState,
    );
  }, []);
  const handleChange = useCallback(
    (event) => {
      setUpdatedValue(event.target.value, event);
    },
    [setUpdatedValue],
  );
  const handleKeyDown = useCallback(
    (event) => {
      const value = getNumberValue(event.currentTarget.value);
      if (!isNaN(value) && isValidKeyCode(event.keyCode)) {
        const offset = arrowOffset || DEFAULT_ARROW_OFFSET;
        const updatedValue = event.keyCode === UP_KEY_CODE ? value + offset : value - offset;
        setUpdatedValue(updatedValue, event);
      }
    },
    [arrowOffset, setUpdatedValue],
  );
  useEffect(() => {
    if (value !== state.value && (prevPropsValueRef.current !== value || prevStateValueRef.current !== state.value)) {
      const nextValue = String(value).toUpperCase();
      if (inputRef.current === document.activeElement) {
        setState((currentState) => Object.assign(Object.assign({}, currentState), { blurValue: nextValue }));
      } else {
        setState((currentState) => ({
          value: nextValue,
          blurValue: currentState.blurValue ? currentState.blurValue : nextValue,
        }));
      }
    }
    prevPropsValueRef.current = value;
    prevStateValueRef.current = state.value;
  }, [state.value, value]);
  useEffect(() => {
    if (!isDragging) {
      return;
    }
    const handleWindowMouseMove = (event) => {
      handleDrag(event);
    };
    const handleWindowMouseUp = () => {
      setIsDragging(false);
    };
    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [handleDrag, isDragging]);
  const styles = reactCSS(
    {
      default: {
        wrap: {
          position: 'relative',
        },
      },
      'user-override': {
        wrap: (style === null || style === void 0 ? void 0 : style.wrap) || {},
        input: (style === null || style === void 0 ? void 0 : style.input) || {},
        label: (style === null || style === void 0 ? void 0 : style.label) || {},
      },
      'dragLabel-true': {
        label: {
          cursor: 'ew-resize',
        },
      },
    },
    {
      'user-override': true,
    },
    props,
  );
  return _jsxs('div', {
    style: styles.wrap,
    children: [
      _jsx('input', {
        id: inputId,
        style: styles.input,
        ref: inputRef,
        value: state.value,
        onKeyDown: handleKeyDown,
        onChange: handleChange,
        onBlur: handleBlur,
        placeholder: placeholder,
        spellCheck: 'false',
      }),
      label && !hideLabel
        ? _jsx('label', { htmlFor: inputId, style: styles.label, onMouseDown: handleMouseDown, children: label })
        : null,
    ],
  });
}
export default EditableInput;
