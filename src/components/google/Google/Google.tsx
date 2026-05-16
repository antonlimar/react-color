import {
  ColorWrap,
  Saturation,
  Hue,
  bem,
  getThemeDataAttributes,
  getDeprecatedStyleOverride,
} from '@/components/common';
import type { ClassName, ColorPickerInjectedProps, PickerClassNames, PickerCustomStyles, PickerTheme } from '@/types';
import { GoogleFields } from '../GoogleFields';
import { GooglePointer } from '../GooglePointer';
import { GooglePointerCircle } from '../GooglePointerCircle';
import './Google.scss';

interface GoogleProps extends ColorPickerInjectedProps {
  width?: string | number;
  styles?: PickerCustomStyles;
  header?: string;
  className?: ClassName;
  classNames?: PickerClassNames;
  theme?: PickerTheme;
}

const b = bem('google');

const GOOGLE_STYLE_SLOTS = ['picker', 'head', 'saturation', 'swatch', 'body', 'controls', 'hue'] as const;

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
      className={b({ dark: theme === 'dark', light: theme === 'light' }).mix(
        'google-picker',
        className,
        classNames?.root,
      )}
      {...getThemeDataAttributes(theme)}
    >
      <div className={b('head')} style={headStyle}>
        {header}
      </div>
      <div className={b('swatch')} style={swatchStyle} />
      <div className={b('saturation')} style={saturationStyle}>
        <Saturation hsl={hsl} hsv={hsv} pointer={GooglePointerCircle} onChange={onChange} />
      </div>
      <div className={b('body')} style={bodyStyle}>
        <div className={b('controls')} style={controlsStyle}>
          <div className={b('hue')} style={hueStyle}>
            <Hue hsl={hsl} radius="4px" pointer={GooglePointer} onChange={onChange} />
          </div>
        </div>
        <GoogleFields rgb={rgb} hsl={hsl} hex={hex} hsv={hsv} onChange={onChange} />
      </div>
    </div>
  );
}

export const Google = ColorWrap(GoogleBase);
