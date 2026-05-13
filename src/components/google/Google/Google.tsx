import { ColorWrap, Saturation, Hue } from '@/components/common';
import { bem, getThemeDataAttributes } from '@/components/common/styleArchitecture';
import { getDeprecatedStyleOverride } from '@/components/common/styleOverrides';
import './Google.scss';
import { GooglePointerCircle } from '@/components/google/GooglePointerCircle';
import { GooglePointer } from '@/components/google/GooglePointer';
import { GoogleFields } from '@/components/google/GoogleFields';
import type { ClassName, ColorPickerInjectedProps, PickerClassNames, PickerCustomStyles, PickerTheme } from '@/types';

const b = bem('google');

const GOOGLE_STYLE_SLOTS = ['picker', 'head', 'saturation', 'swatch', 'body', 'controls', 'hue'] as const;

type GoogleProps = ColorPickerInjectedProps & {
  width?: string | number;
  styles?: PickerCustomStyles;
  header?: string;
  className?: ClassName;
  classNames?: PickerClassNames;
  theme?: PickerTheme;
};

function GoogleBase({
  width = 652,
  onChange,
  rgb,
  hsl,
  hsv,
  hex,
  header = 'Color picker',
  styles: passedStyles = {},
  className = '',
  classNames,
  theme,
}: GoogleProps) {
  const rootStyle = {
    width,
    ...getDeprecatedStyleOverride(passedStyles, 'picker', GOOGLE_STYLE_SLOTS, 'picker'),
  };
  const headStyle = getDeprecatedStyleOverride(passedStyles, 'head', GOOGLE_STYLE_SLOTS, 'head');
  const swatchStyle = {
    background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
    ...getDeprecatedStyleOverride(passedStyles, 'swatch', GOOGLE_STYLE_SLOTS, 'swatch'),
  };
  const saturationStyle = getDeprecatedStyleOverride(passedStyles, 'saturation', GOOGLE_STYLE_SLOTS, 'saturation');
  const bodyStyle = getDeprecatedStyleOverride(passedStyles, 'body', GOOGLE_STYLE_SLOTS, 'body');
  const controlsStyle = getDeprecatedStyleOverride(passedStyles, 'controls', GOOGLE_STYLE_SLOTS, 'controls');
  const hueStyle = getDeprecatedStyleOverride(passedStyles, 'hue', GOOGLE_STYLE_SLOTS, 'hue');

  return (
    <div
      style={rootStyle}
      className={b({ dark: theme === 'dark', light: theme === 'light' })
        .mix('google-picker', className, classNames?.root)
        .toString()}
      {...getThemeDataAttributes(theme)}
    >
      <div className={b('head').toString()} style={headStyle}>
        {header}
      </div>
      <div className={b('swatch').toString()} style={swatchStyle} />
      <div className={b('saturation').toString()} style={saturationStyle}>
        <Saturation hsl={hsl} hsv={hsv} pointer={GooglePointerCircle} onChange={onChange} />
      </div>
      <div className={b('body').toString()} style={bodyStyle}>
        <div className={b('controls').toString()} style={controlsStyle}>
          <div className={b('hue').toString()} style={hueStyle}>
            <Hue hsl={hsl} radius="4px" pointer={GooglePointer} onChange={onChange} />
          </div>
        </div>
        <GoogleFields rgb={rgb} hsl={hsl} hex={hex} hsv={hsv} onChange={onChange} />
      </div>
    </div>
  );
}

export const Google = ColorWrap(GoogleBase);
