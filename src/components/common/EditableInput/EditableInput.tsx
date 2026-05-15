import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, ChangeEvent, KeyboardEvent, MouseEvent } from 'react';
import type {
  EditableInputChangeEvent,
  EditableInputChangeValue,
  EditableInputProps,
  EditableInputValue,
} from './types';
import { bem } from '@/components/common';
import './EditableInput.scss';

const b = bem('editableInput');

const DEFAULT_ARROW_OFFSET = 1;
const UP_KEY_CODE = 38;
const DOWN_KEY_CODE = 40;
const VALID_KEY_CODES = [UP_KEY_CODE, DOWN_KEY_CODE];

const isValidKeyCode = (keyCode: number) => VALID_KEY_CODES.indexOf(keyCode) > -1;
const getNumberValue = (value: EditableInputValue) => Number(String(value).replace(/%/g, ''));

type EditableInputState = {
  value: EditableInputValue;
  blurValue: EditableInputValue | null;
};

let idCounter = 1;

export function EditableInput(props: EditableInputProps) {
  const { arrowOffset, dragLabel, dragMax, hideLabel, label, onChange, placeholder, style, value } = props;
  const [state, setState] = useState<EditableInputState>(() => {
    const initialValue = String(value).toUpperCase();

    return {
      value: initialValue,
      blurValue: initialValue,
    };
  });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputId] = useState(() => `rc-editable-input-${idCounter++}`);
  const [isDragging, setIsDragging] = useState(false);
  const prevPropsValueRef = useRef<EditableInputProps['value']>(props.value);
  const prevStateValueRef = useRef<EditableInputState['value']>(state.value);

  const getValueObjectWithLabel = useCallback(
    (value: EditableInputValue) => ({
      [label!]: value,
    }),
    [label],
  );

  const setUpdatedValue = useCallback(
    (value: EditableInputValue, event: EditableInputChangeEvent) => {
      const onChangeValue: EditableInputChangeValue = label ? getValueObjectWithLabel(value) : value;
      onChange?.(onChangeValue, event);

      setState((currentState) => ({ ...currentState, value }));
    },
    [getValueObjectWithLabel, label, onChange],
  );

  const handleDrag = useCallback(
    (event: globalThis.MouseEvent) => {
      if (dragLabel) {
        const newValue = Math.round((value as number) + event.movementX);

        if (newValue >= 0 && newValue <= dragMax!) {
          onChange?.(getValueObjectWithLabel(newValue), event);
        }
      }
    },
    [dragLabel, dragMax, getValueObjectWithLabel, onChange, value],
  );

  const handleMouseDown = useCallback(
    (event: MouseEvent<HTMLLabelElement>) => {
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
    (event: ChangeEvent<HTMLInputElement>) => {
      setUpdatedValue(event.target.value, event);
    },
    [setUpdatedValue],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
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
        setState((currentState) => ({ ...currentState, blurValue: nextValue }));
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

    const handleWindowMouseMove = (event: globalThis.MouseEvent) => {
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

  const wrapStyle: CSSProperties = {
    ...style?.wrap,
  };
  const inputStyle: CSSProperties = {
    ...style?.input,
  };
  const labelStyle: CSSProperties = {
    ...style?.label,
  };

  return (
    <div className={b({ 'drag-label': dragLabel }).toString()} style={wrapStyle}>
      <input
        id={inputId}
        className={b('input').toString()}
        style={inputStyle}
        ref={inputRef}
        value={state.value}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        spellCheck="false"
      />
      {label && !hideLabel ? (
        <label
          htmlFor={inputId}
          className={b('label', { 'drag-label': dragLabel }).toString()}
          style={labelStyle}
          onMouseDown={handleMouseDown}
        >
          {label}
        </label>
      ) : null}
    </div>
  );
}
