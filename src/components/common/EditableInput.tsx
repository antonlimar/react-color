import { PureComponent } from 'react';
import reactCSS from 'reactcss';
import type { ChangeEvent, KeyboardEvent, MouseEvent } from 'react';
import type { Component as ReactComponent } from 'react';
import type {
  EditableInputChangeEvent,
  EditableInputChangeValue,
  EditableInputProps,
  EditableInputValue,
} from '../../types';

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

const BaseEditableInput = PureComponent as new (
  props: EditableInputProps,
) => ReactComponent<EditableInputProps, EditableInputState>;

let idCounter = 1;

export class EditableInput extends BaseEditableInput {
  state: EditableInputState = {
    value: String(this.props.value).toUpperCase(),
    blurValue: String(this.props.value).toUpperCase(),
  };

  input: HTMLInputElement | null = null;
  inputId = `rc-editable-input-${idCounter++}`;

  componentDidUpdate(prevProps: EditableInputProps, prevState: EditableInputState) {
    if (
      this.props.value !== this.state.value &&
      (prevProps.value !== this.props.value || prevState.value !== this.state.value)
    ) {
      if (this.input === document.activeElement) {
        this.setState({ blurValue: String(this.props.value).toUpperCase() });
      } else {
        this.setState({
          value: String(this.props.value).toUpperCase(),
          blurValue: this.state.blurValue ? this.state.blurValue : String(this.props.value).toUpperCase(),
        });
      }
    }
  }

  componentWillUnmount() {
    this.unbindEventListeners();
  }

  getValueObjectWithLabel(value: EditableInputValue) {
    return {
      [this.props.label!]: value,
    };
  }

  handleBlur = () => {
    if (this.state.blurValue) {
      this.setState({ value: this.state.blurValue, blurValue: null });
    }
  };

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setUpdatedValue(event.target.value, event);
  };

  getArrowOffset() {
    return this.props.arrowOffset || DEFAULT_ARROW_OFFSET;
  }

  handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const value = getNumberValue(event.currentTarget.value);

    if (!isNaN(value) && isValidKeyCode(event.keyCode)) {
      const offset = this.getArrowOffset();
      const updatedValue = event.keyCode === UP_KEY_CODE ? value + offset : value - offset;

      this.setUpdatedValue(updatedValue, event);
    }
  };

  setUpdatedValue(value: EditableInputValue, event: EditableInputChangeEvent) {
    const onChangeValue: EditableInputChangeValue = this.props.label ? this.getValueObjectWithLabel(value) : value;
    this.props.onChange?.(onChangeValue, event);

    this.setState({ value });
  }

  handleDrag = (event: globalThis.MouseEvent) => {
    if (this.props.dragLabel) {
      const newValue = Math.round((this.props.value as number) + event.movementX);

      if (newValue >= 0 && newValue <= this.props.dragMax!) {
        this.props.onChange?.(this.getValueObjectWithLabel(newValue), event);
      }
    }
  };

  handleMouseDown = (event: MouseEvent<HTMLLabelElement>) => {
    if (this.props.dragLabel) {
      event.preventDefault();
      this.handleDrag(event.nativeEvent);
      window.addEventListener('mousemove', this.handleDrag);
      window.addEventListener('mouseup', this.handleMouseUp);
    }
  };

  handleMouseUp = () => {
    this.unbindEventListeners();
  };

  unbindEventListeners = () => {
    window.removeEventListener('mousemove', this.handleDrag);
    window.removeEventListener('mouseup', this.handleMouseUp);
  };

  render() {
    const styles = reactCSS(
      {
        default: {
          wrap: {
            position: 'relative',
          },
        },
        'user-override': {
          wrap: this.props.style?.wrap || {},
          input: this.props.style?.input || {},
          label: this.props.style?.label || {},
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
      this.props,
    );

    return (
      <div style={styles.wrap}>
        <input
          id={this.inputId}
          style={styles.input}
          ref={(input) => {
            this.input = input;
          }}
          value={this.state.value}
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          placeholder={this.props.placeholder}
          spellCheck="false"
        />
        {this.props.label && !this.props.hideLabel ? (
          <label htmlFor={this.inputId} style={styles.label} onMouseDown={this.handleMouseDown}>
            {this.props.label}
          </label>
        ) : null}
      </div>
    );
  }
}

export default EditableInput;
