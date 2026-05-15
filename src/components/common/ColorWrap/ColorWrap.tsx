import { debounce } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import { simpleCheckForValidColor, toState } from '@/helpers';
import type {
  Color,
  ColorChangeHandler,
  ColorChangeValue,
  ColorPickerChangeEvent,
  ColorPickerInjectedProps,
  ColorPickerProps,
  ColorResult,
} from '@/types';

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

type DebouncedColorChange = {
  (fn: ColorChangeHandler, data: ColorResult, event: ColorPickerChangeEvent): void;
  cancel(): void;
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

export function ColorWrap<PickerProps extends ColorPickerInjectedProps>(
  Picker: PickerComponent<PickerProps>,
): WrappedColorPickerComponent<PickerProps> {
  const ColorPicker = (props: WrappedColorPickerProps<PickerProps>) => {
    const { onChange, onChangeComplete, onSwatchHover } = props;
    const [state, setState] = useState<ColorWrapState>(() => {
      const resolvedColor = getColorWithDefault(props.color);

      return {
        ...toState(resolvedColor, 0),
        colorPropKey: getColorPropKey(resolvedColor),
      };
    });
    const debounceRef = useRef<DebouncedColorChange>(
      debounce((fn: unknown, data: unknown, event: unknown) => {
        (fn as ColorChangeHandler)(data as ColorResult, event as ColorPickerChangeEvent);
      }, 100) as DebouncedColorChange,
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
        : {
            ...toState(getColorWithDefault(props.color), state.oldHue),
            colorPropKey: nextColorPropKey,
          };

    const handleChange = (data: Color | ColorChangeValue, event?: ColorPickerChangeEvent) => {
      const isValidColor = simpleCheckForValidColor(data);

      if (isValidColor) {
        const colors = toState(data, getOldHue(data, currentState.oldHue));
        setState({
          ...colors,
          colorPropKey: currentState.colorPropKey,
        });
        onChangeComplete && debounceRef.current(onChangeComplete, colors, event);
        onChange && onChange(colors, event);
      }
    };

    const handleSwatchHover = (data: Color | ColorChangeValue, event?: ColorPickerChangeEvent) => {
      const isValidColor = simpleCheckForValidColor(data);

      if (isValidColor) {
        const colors = toState(data, getOldHue(data, currentState.oldHue));
        onSwatchHover && onSwatchHover(colors, event);
      }
    };

    const optionalEvents: Partial<ColorPickerInjectedProps> = {};
    const pickerProps = {
      ...props,
      color: getColorWithDefault(props.color),
    } as unknown as PickerProps;

    if (onSwatchHover) {
      optionalEvents.onSwatchHover = handleSwatchHover;
    }

    return <Picker {...pickerProps} {...currentState} onChange={handleChange} {...optionalEvents} />;
  };

  return ColorPicker as WrappedColorPickerComponent<PickerProps>;
}
