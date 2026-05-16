import { ColorWrap, Alpha as AlphaControl, bem, getThemeDataAttributes } from '@/components/common';
import type { AlphaProps } from '@/components/common';
import type {
  CheckboardRenderers,
  ClassName,
  ColorPickerInjectedProps,
  PickerClassNames,
  PickerStyle,
  PickerTheme,
} from '@/types';
import { AlphaPointer } from '../AlphaPointer';
import './Alpha.scss';

interface AlphaPickerProps extends ColorPickerInjectedProps {
  width?: string | number;
  height?: string | number;
  direction?: AlphaProps['direction'];
  style?: PickerStyle;
  renderers?: CheckboardRenderers;
  pointer?: AlphaProps['pointer'];
  className?: ClassName;
  classNames?: PickerClassNames;
  theme?: PickerTheme;
}

const b = bem('alpha');

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
      className={b({ dark: theme === 'dark', light: theme === 'light' }).mix(
        'alpha-picker',
        className,
        classNames?.root,
      )}
      {...getThemeDataAttributes(theme)}
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
