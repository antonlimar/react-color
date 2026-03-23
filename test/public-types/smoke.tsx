import type { ComponentProps } from 'react';
import React from 'react';
import ChromePickerDefault, {
  CustomPicker,
  EditableInput,
  GooglePicker,
  SketchPicker,
  type ColorPickerProps,
  type ColorResult,
  type CustomPickerInjectedProps,
  type HSLAColor,
  type RGBAColor,
} from 'react-color';
import SketchPickerEsm from 'react-color/es/Sketch';
import HuePickerLib from 'react-color/lib/Hue';
import { EditableInput as EditableInputLib } from 'react-color/lib/components/common';

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
};

const WrappedBase = ({ hex, onChange }: CustomPickerInjectedProps) => (
  <button type="button" onClick={() => onChange('#000000')}>
    {hex}
  </button>
);

const WrappedPicker = CustomPicker(WrappedBase);

const elements = (
  <div>
    <ChromePickerDefault {...defaultPickerProps} />
    <SketchPicker {...sketchProps} />
    <GooglePicker {...googleProps} />
    <SketchPickerEsm color="#00ff00" />
    <HuePickerLib color="#0000ff" />
    <EditableInput value="ff0000" onChange={() => undefined} />
    <EditableInputLib value="00ff00" onChange={() => undefined} />
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
