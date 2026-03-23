import React, { PureComponent } from 'react';
import debounce from 'lodash/debounce';

import * as color from '../../helpers/color';
import type {
  Color,
  ColorChangeHandler,
  ColorChangeValue,
  ColorPickerChangeEvent,
  ColorPickerInjectedProps,
  ColorPickerProps,
  ColorResult,
} from '../../types';

type PickerStatics = {
  defaultProps?: Record<string, unknown>;
};

type WrappedColorPickerProps<PickerProps extends ColorPickerInjectedProps> = Omit<
  PickerProps,
  keyof ColorPickerInjectedProps
> &
  ColorPickerProps;

type PickerComponent<PickerProps extends ColorPickerInjectedProps> = React.ComponentType<PickerProps> & PickerStatics;

type WrappedColorPickerComponent<PickerProps extends ColorPickerInjectedProps> = React.ComponentType<
  WrappedColorPickerProps<PickerProps>
> &
  PickerStatics;

const defaultColor: Color = {
  h: 250,
  s: 0.5,
  l: 0.2,
  a: 1,
};

const getOldHue = (data: Color | ColorChangeValue, oldHue: number): number => {
  if (typeof data === 'object' && data !== null && 'h' in data && typeof data.h === 'number') {
    return data.h;
  }

  return oldHue;
};

export const ColorWrap = <PickerProps extends ColorPickerInjectedProps>(
  Picker: PickerComponent<PickerProps>,
): WrappedColorPickerComponent<PickerProps> => {
  class ColorPicker extends PureComponent<WrappedColorPickerProps<PickerProps>, ColorResult> {
    private debounce: (fn: ColorChangeHandler, data: ColorResult, event: ColorPickerChangeEvent) => void;

    constructor(props: WrappedColorPickerProps<PickerProps>) {
      super(props);

      this.state = {
        ...color.toState(props.color ?? defaultColor, 0),
      };

      this.debounce = debounce((fn: ColorChangeHandler, data: ColorResult, event: ColorPickerChangeEvent) => {
        fn(data, event);
      }, 100);
    }

    static getDerivedStateFromProps(nextProps: WrappedColorPickerProps<PickerProps>, state: ColorResult): ColorResult {
      return {
        ...color.toState(nextProps.color ?? defaultColor, state.oldHue),
      };
    }

    handleChange = (data: Color | ColorChangeValue, event?: ColorPickerChangeEvent) => {
      const isValidColor = color.simpleCheckForValidColor(data);

      if (isValidColor) {
        const colors = color.toState(data, getOldHue(data, this.state.oldHue));
        this.setState(colors);
        this.props.onChangeComplete && this.debounce(this.props.onChangeComplete, colors, event);
        this.props.onChange && this.props.onChange(colors, event);
      }
    };

    handleSwatchHover = (data: Color | ColorChangeValue, event?: ColorPickerChangeEvent) => {
      const isValidColor = color.simpleCheckForValidColor(data);

      if (isValidColor) {
        const colors = color.toState(data, getOldHue(data, this.state.oldHue));
        this.props.onSwatchHover && this.props.onSwatchHover(colors, event);
      }
    };

    render() {
      const optionalEvents: Partial<ColorPickerInjectedProps> = {};
      const pickerProps = this.props as unknown as PickerProps;

      if (this.props.onSwatchHover) {
        optionalEvents.onSwatchHover = this.handleSwatchHover;
      }

      return <Picker {...pickerProps} {...this.state} onChange={this.handleChange} {...optionalEvents} />;
    }
  }

  (ColorPicker as typeof ColorPicker & PickerStatics).defaultProps = {
    ...Picker.defaultProps,
    color: defaultColor,
  };

  return ColorPicker as WrappedColorPickerComponent<PickerProps>;
};

export default ColorWrap;
