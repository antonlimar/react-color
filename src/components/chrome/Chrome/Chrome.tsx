import { ColorWrap, Saturation, Hue, Alpha, Checkboard } from '@/components/common';
import { bem, getThemeDataAttributes } from '@/components/common/styleArchitecture';
import { getDeprecatedStyleOverride } from '@/components/common/styleOverrides';
import { ChromeFields } from '@/components/chrome/ChromeFields';
import { ChromePointer } from '@/components/chrome/ChromePointer';
import { ChromePointerCircle } from '@/components/chrome/ChromePointerCircle';
import './Chrome.scss';

import type {
  CheckboardRenderers,
  ClassName,
  ColorPickerInjectedProps,
  PickerClassNames,
  PickerCustomStyles,
  PickerTheme,
} from '@/types';

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
      className={b({ 'disabled-alpha': disableAlpha, dark: theme === 'dark', light: theme === 'light' })
        .mix('chrome-picker', className, classNames?.root)
        .toString()}
      {...getThemeDataAttributes(theme)}
    >
      <div className={b('saturation').toString()} style={saturationStyle}>
        <Saturation radius="2px 2px 0 0" hsl={hsl} hsv={hsv} pointer={ChromePointerCircle} onChange={onChange} />
      </div>
      <div className={b('body').toString()} style={bodyStyle}>
        <div className={b('controls').toString()} style={controlsStyle}>
          <div className={b('color').toString()} style={colorStyle}>
            <div className={b('swatch').toString()} style={swatchStyle}>
              <div className={b('active').toString()} style={activeStyle} />
              <Checkboard renderers={renderers} />
            </div>
          </div>
          <div className={b('toggles').toString()} style={togglesStyle}>
            <div className={b('hue').toString()} style={hueStyle}>
              <Hue radius="2px" hsl={hsl} pointer={ChromePointer} onChange={onChange} />
            </div>
            <div className={b('alpha').toString()} style={alphaStyle}>
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
