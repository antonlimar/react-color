import {
  ColorWrap,
  Saturation,
  Hue,
  Alpha,
  Checkboard,
  bem,
  getThemeDataAttributes,
  getDeprecatedStyleOverride,
} from '@/components/common';
import type {
  CheckboardRenderers,
  ClassName,
  ColorPickerInjectedProps,
  PickerClassNames,
  PickerCustomStyles,
  PickerTheme,
} from '@/types';
import { ChromeFields } from '../ChromeFields';
import { ChromePointer } from '../ChromePointer';
import { ChromePointerCircle } from '../ChromePointerCircle';
import './Chrome.scss';

type ChromeProps = ColorPickerInjectedProps & {
  width?: string | number;
  disableAlpha?: boolean;
  renderers?: CheckboardRenderers;
  styles?: PickerCustomStyles;
  className?: ClassName;
  classNames?: PickerClassNames;
  theme?: PickerTheme;
  defaultView?: 'hex' | 'rgb' | 'hsl';
};

const b = bem('chrome');

const CHROME_STYLE_SLOTS = [
  'picker',
  'saturation',
  'body',
  'controls',
  'color',
  'swatch',
  'active',
  'toggles',
  'hue',
  'alpha',
] as const;

function ChromeBase({
  width = 225,
  onChange,
  disableAlpha = false,
  rgb,
  hsl,
  hsv,
  hex,
  renderers,
  styles: passedStyles = {},
  className = '',
  classNames,
  theme,
  defaultView,
}: ChromeProps) {
  const rootStyle = {
    width,
    ...getDeprecatedStyleOverride(passedStyles, 'picker', CHROME_STYLE_SLOTS, 'picker'),
  };
  const saturationStyle = getDeprecatedStyleOverride(passedStyles, 'saturation', CHROME_STYLE_SLOTS, 'saturation');
  const bodyStyle = getDeprecatedStyleOverride(passedStyles, 'body', CHROME_STYLE_SLOTS, 'body');
  const controlsStyle = getDeprecatedStyleOverride(passedStyles, 'controls', CHROME_STYLE_SLOTS, 'controls');
  const colorStyle = getDeprecatedStyleOverride(passedStyles, 'color', CHROME_STYLE_SLOTS, 'color');
  const swatchStyle = getDeprecatedStyleOverride(passedStyles, 'swatch', CHROME_STYLE_SLOTS, 'swatch');
  const activeStyle = {
    background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`,
    ...getDeprecatedStyleOverride(passedStyles, 'active', CHROME_STYLE_SLOTS, 'active'),
  };
  const togglesStyle = getDeprecatedStyleOverride(passedStyles, 'toggles', CHROME_STYLE_SLOTS, 'toggles');
  const hueStyle = getDeprecatedStyleOverride(passedStyles, 'hue', CHROME_STYLE_SLOTS, 'hue');
  const alphaStyle = getDeprecatedStyleOverride(passedStyles, 'alpha', CHROME_STYLE_SLOTS, 'alpha');

  return (
    <div
      style={rootStyle}
      className={b({ 'disabled-alpha': disableAlpha, dark: theme === 'dark', light: theme === 'light' }).mix(
        'chrome-picker',
        className,
        classNames?.root,
      )}
      {...getThemeDataAttributes(theme)}
    >
      <div className={b('saturation')} style={saturationStyle}>
        <Saturation radius="2px 2px 0 0" hsl={hsl} hsv={hsv} pointer={ChromePointerCircle} onChange={onChange} />
      </div>
      <div className={b('body')} style={bodyStyle}>
        <div className={b('controls')} style={controlsStyle}>
          <div className={b('color')} style={colorStyle}>
            <div className={b('swatch')} style={swatchStyle}>
              <div className={b('active')} style={activeStyle} />
              <Checkboard renderers={renderers} />
            </div>
          </div>
          <div className={b('toggles')} style={togglesStyle}>
            <div className={b('hue')} style={hueStyle}>
              <Hue radius="2px" hsl={hsl} pointer={ChromePointer} onChange={onChange} />
            </div>
            <div className={b('alpha')} style={alphaStyle}>
              <Alpha
                radius="2px"
                rgb={rgb}
                hsl={hsl}
                pointer={ChromePointer}
                renderers={renderers}
                onChange={onChange}
              />
            </div>
          </div>
        </div>
        <ChromeFields
          rgb={rgb}
          hsl={hsl}
          hex={hex}
          view={defaultView}
          onChange={onChange}
          disableAlpha={disableAlpha}
        />
      </div>
    </div>
  );
}

export const Chrome = ColorWrap(ChromeBase);
