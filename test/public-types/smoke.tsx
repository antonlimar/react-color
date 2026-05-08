import 'react-color/es/styles/index.css';
import 'react-color/es/styles/pickers/sketch.css';
import 'react-color/es/styles/common/editable-input.css';

import type { ComponentProps } from 'react';
import React from 'react';
import {
  ChromePicker,
  CustomPicker,
  EditableInput,
  GooglePicker,
  HuePicker,
  type PickerClassNames,
  type PickerTheme,
  SketchPicker,
  type ColorPickerProps,
  type ColorResult,
  type CustomPickerInjectedProps,
  type HSLAColor,
  type RGBAColor,
} from 'react-color';

const rgba: RGBAColor = { r: 255, g: 0, b: 0, a: 1 };
const hsl: HSLAColor = { h: 0, s: 1, l: 0.5, a: 1 };

const handleColorChange = (color: ColorResult) => color.hex;

const sketchProps: ComponentProps<typeof SketchPicker> = {
  color: rgba,
  onChange: handleColorChange,
};

const googleProps: ComponentProps<typeof GooglePicker> = {
  color: hsl,
  onChangeComplete: handleColorChange,
};

const defaultPickerProps: ColorPickerProps = {
  color: '#ff0000',
  onChange: handleColorChange,
  theme: 'dark',
  classNames: {
    root: 'consumer-root',
  },
};

const pickerTheme: PickerTheme = 'auto';
const pickerClassNames: PickerClassNames<'root' | 'body'> = {
  root: 'consumer-root',
  body: 'consumer-body',
};

void pickerTheme;
void pickerClassNames;

const WrappedBase = ({ hex, onChange }: CustomPickerInjectedProps) => (
  <button type="button" onClick={() => onChange('#000000')}>
    {hex}
  </button>
);

const WrappedPicker = CustomPicker(WrappedBase);

const elements = (
  <div>
    <ChromePicker {...defaultPickerProps} />
    <SketchPicker {...sketchProps} theme="light" classNames={pickerClassNames} />
    <GooglePicker {...googleProps} />
    <HuePicker color="#00ff00" />
    <EditableInput value="ff0000" onChange={() => undefined} />
    <WrappedPicker color="#ffffff" />
  </div>
);

void elements;

// @ts-expect-error boolean is not a valid public `color` prop
const invalidSketchProps: ComponentProps<typeof SketchPicker> = { color: false };
void invalidSketchProps;

// @ts-expect-error public wrapped picker should preserve the same `color` contract
const invalidWrappedPicker = <WrappedPicker color={false} />;
void invalidWrappedPicker;

// @ts-expect-error theme only accepts the public light/dark/auto contract
const invalidTheme: PickerTheme = 'system';
void invalidTheme;
