import { ColorWrap, Alpha as AlphaControl } from '@/components/common';
import { getPickerRootProps } from '@/components/common/styleArchitecture';
import { AlphaPointer } from '@/components/alpha/AlphaPointer';
import type {
  AlphaProps,
  CheckboardRenderers,
  ClassName,
  ColorPickerInjectedProps,
  PickerClassNames,
  PickerStyle,
  PickerTheme,
} from '@/types';

type AlphaPickerProps = ColorPickerInjectedProps & {
  width?: string | number;
  height?: string | number;
  direction?: AlphaProps['direction'];
  style?: PickerStyle;
  renderers?: CheckboardRenderers;
  pointer?: AlphaProps['pointer'];
  className?: ClassName;
  classNames?: PickerClassNames;
  theme?: PickerTheme;
};

function AlphaPicker({
  rgb,
  hsl,
  width = '316px',
  height = '16px',
  onChange,
  direction = 'horizontal',
  style,
  renderers,
  pointer = AlphaPointer,
  className = '',
  classNames,
  theme,
}: AlphaPickerProps) {
  return (
    <div
      style={{ width, height }}
      {...getPickerRootProps({
        block: 'alpha',
        theme,
        className: `alpha-picker ${className}`,
        classNames,
      })}
    >
      <AlphaControl
        rgb={rgb}
        hsl={hsl}
        radius="2px"
        style={style}
        pointer={pointer}
        renderers={renderers}
        onChange={onChange}
        direction={direction}
      />
    </div>
  );
}

export const Alpha = ColorWrap(AlphaPicker);
