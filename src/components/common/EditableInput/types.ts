import type { ChangeEvent, KeyboardEvent } from 'react';
import type { PickerStyle } from '@/types';

export interface EditableInputStyle {
  wrap?: PickerStyle;
  input?: PickerStyle;
  label?: PickerStyle;
}

export type EditableInputValue = string | number;
export type EditableInputChangeValue = EditableInputValue | Record<string, EditableInputValue>;

export type EditableInputChangeEvent =
  | ChangeEvent<HTMLInputElement>
  | KeyboardEvent<HTMLInputElement>
  | globalThis.MouseEvent;

export interface EditableInputProps {
  label?: string | null;
  value?: EditableInputValue;
  placeholder?: string;
  arrowOffset?: number;
  dragLabel?: boolean;
  dragMax?: number;
  style?: EditableInputStyle;
  hideLabel?: boolean;
  onChange?: (value: EditableInputChangeValue, event: EditableInputChangeEvent) => void;
}
