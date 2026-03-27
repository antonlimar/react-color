import { PureComponent } from 'react';
import debounce from 'lodash/debounce';
import type { ComponentType } from 'react';

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

type WrappedColorPickerProps<PickerProps extends ColorPickerInjectedProps> = Omit<
  PickerProps,
  keyof ColorPickerInjectedProps
> &
  ColorPickerProps;

type PickerComponent<PickerProps extends ColorPickerInjectedProps> = ComponentType<PickerProps>;

type WrappedColorPickerComponent<PickerProps extends ColorPickerInjectedProps> = ComponentType<
  WrappedColorPickerProps<PickerProps>
>;

type ColorWrapState = ColorResult & {
  colorPropKey: string;
};

const defaultColor: Color = {
  h: 250,
  s: 0.5,
  l: 0.2,
  a: 1,
};

const getColorWithDefault = (colorProp?: Color): Color => colorProp ?? defaultColor;

const getColorPropKey = (colorProp?: Color): string => {
  const value = getColorWithDefault(colorProp);

  return typeof value === 'string' ? value : JSON.stringify(value);
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
  class ColorPicker extends PureComponent<WrappedColorPickerProps<PickerProps>, ColorWrapState> {
    private debounce: (fn: ColorChangeHandler, data: ColorResult, event: ColorPickerChangeEvent) => void;

    constructor(props: WrappedColorPickerProps<PickerProps>) {
      super(props);

      const resolvedColor = getColorWithDefault(props.color);

      this.state = {
        ...color.toState(resolvedColor, 0),
        colorPropKey: getColorPropKey(resolvedColor),
      };

      this.debounce = debounce((fn: ColorChangeHandler, data: ColorResult, event: ColorPickerChangeEvent) => {
        fn(data, event);
      }, 100);
    }

    static getDerivedStateFromProps(
      nextProps: WrappedColorPickerProps<PickerProps>,
      state: ColorWrapState,
    ): ColorWrapState | null {
      const nextColorPropKey = getColorPropKey(nextProps.color);

      if (nextColorPropKey === state.colorPropKey) {
        return null;
      }

      const resolvedColor = getColorWithDefault(nextProps.color);

      return {
        ...color.toState(resolvedColor, state.oldHue),
        colorPropKey: getColorPropKey(resolvedColor),
      };
    }

    handleChange = (data: Color | ColorChangeValue, event?: ColorPickerChangeEvent) => {
      const isValidColor = color.simpleCheckForValidColor(data);

      if (isValidColor) {
        const colors = color.toState(data, getOldHue(data, this.state.oldHue));
        this.setState((prevState) => ({
          ...colors,
          colorPropKey: prevState.colorPropKey,
        }));
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
      const pickerProps = {
        ...this.props,
        color: getColorWithDefault(this.props.color),
      } as unknown as PickerProps;

      if (this.props.onSwatchHover) {
        optionalEvents.onSwatchHover = this.handleSwatchHover;
      }

      return <Picker {...pickerProps} {...this.state} onChange={this.handleChange} {...optionalEvents} />;
    }
  }

  return ColorPicker as WrappedColorPickerComponent<PickerProps>;
};

export default ColorWrap;
