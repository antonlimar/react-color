import type { ComponentProps } from 'react';
import {
  ChromePicker,
  CustomPicker,
  EditableInput,
  GooglePicker,
  HuePicker,
  SketchPicker,
} from '@antonlimar/react-color';
import type {
  ClassName,
  PickerClassNames,
  PickerCustomStyles,
  PickerStyle,
  Radius,
  PickerTheme,
  ColorChangeHandler,
  ColorChangeValue,
  ColorInputChangeHandler,
  ColorPickerChangeEvent,
  ColorPickerInjectedProps,
  ColorPickerProps,
  ColorResult,
  CustomPickerInjectedProps,
  HSLAColor,
  HSVAColor,
  PointerComponent,
  RGBAColor,
  SaturationProps,
  SwatchHoverEvent,
  SwatchHoverHandler,
} from '@antonlimar/react-color';

const className: ClassName = 'consumer-root';
const rgba: RGBAColor = { r: 255, g: 0, b: 0, a: 1 };
const hsl: HSLAColor = { h: 0, s: 1, l: 0.5, a: 1 };
const hsv: HSVAColor = { h: 0, s: 1, v: 1, a: 1 };
const radius: Radius = 4;
const pickerStyle: PickerStyle = { borderRadius: radius };
const pickerStyles: PickerCustomStyles = { default: pickerStyle };
const colorChangeValue: ColorChangeValue = { hex: '#ff0000', source: 'hex' };
const colorPickerChangeEvent: ColorPickerChangeEvent = undefined;
const swatchHoverEvent: SwatchHoverEvent = colorPickerChangeEvent;

const handleColorChange = (color: ColorResult) => color.hex;
const colorChangeHandler: ColorChangeHandler = handleColorChange;
const colorInputChangeHandler: ColorInputChangeHandler = (color) => color;
const swatchHoverHandler: SwatchHoverHandler = handleColorChange;

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
  root: className,
  body: 'consumer-body',
};
const saturationProps: SaturationProps = {
  hsl,
  hsv,
  onChange: (color) => color.source,
};

void pickerTheme;
void pickerClassNames;
void pickerStyles;
void colorChangeValue;
void swatchHoverEvent;
void colorChangeHandler;
void colorInputChangeHandler;
void swatchHoverHandler;
void saturationProps;

const Pointer: PointerComponent<SaturationProps> = () => <div />;
void Pointer;

const WrappedBase = ({ hex, onChange }: CustomPickerInjectedProps) => (
  <button type="button" onClick={() => onChange('#000000')}>
    {hex}
  </button>
);
const WrappedBaseWithBaseType = ({ hex, onChange }: ColorPickerInjectedProps) => (
  <button type="button" onClick={() => onChange(colorChangeValue)}>
    {hex}
  </button>
);

const WrappedPicker = CustomPicker(WrappedBase);
const WrappedPickerWithBaseType = CustomPicker(WrappedBaseWithBaseType);

const elements = (
  <div>
    <ChromePicker {...defaultPickerProps} />
    <SketchPicker {...sketchProps} theme="light" classNames={pickerClassNames} />
    <GooglePicker {...googleProps} />
    <HuePicker color="#00ff00" />
    <EditableInput value="ff0000" onChange={() => undefined} />
    <WrappedPicker color="#ffffff" />
    <WrappedPickerWithBaseType color="#ffffff" />
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
