import { ColorWrap, Saturation, Hue } from '../../common';
import { getPickerClassName, getPickerRootProps } from '../../common/styleArchitecture';
import { getDeprecatedStyleOverride } from '../../common/styleOverrides';
import { GooglePointerCircle } from '../GooglePointerCircle';
import { GooglePointer } from '../GooglePointer';
import { GoogleFields } from '../GoogleFields';
import type {
  ClassName,
  ColorPickerInjectedProps,
  PickerClassNames,
  PickerCustomStyles,
  PickerTheme,
} from '../../../types';

const GOOGLE_STYLE_SLOTS = ['picker', 'head', 'saturation', 'swatch', 'body', 'controls', 'hue'] as const;

type GoogleProps = ColorPickerInjectedProps & {
  width?: string | number;
  styles?: PickerCustomStyles;
  header?: string;
  className?: ClassName;
  classNames?: PickerClassNames;
  theme?: PickerTheme;
};

const GoogleBase = ({
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
}: GoogleProps) => {
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
      {...getPickerRootProps({
        block: 'google',
        theme,
        className: `google-picker ${className}`,
        classNames,
      })}
    >
      <div className={getPickerClassName({ block: 'google', slot: 'head' })} style={headStyle}>
        {header}
      </div>
      <div className={getPickerClassName({ block: 'google', slot: 'swatch' })} style={swatchStyle} />
      <div className={getPickerClassName({ block: 'google', slot: 'saturation' })} style={saturationStyle}>
        <Saturation hsl={hsl} hsv={hsv} pointer={GooglePointerCircle} onChange={onChange} />
      </div>
      <div className={getPickerClassName({ block: 'google', slot: 'body' })} style={bodyStyle}>
        <div
          className={getPickerClassName({ block: 'google', slot: 'controls', className: 'flexbox-fix' })}
          style={controlsStyle}
        >
          <div className={getPickerClassName({ block: 'google', slot: 'hue' })} style={hueStyle}>
            <Hue hsl={hsl} radius="4px" pointer={GooglePointer} onChange={onChange} />
          </div>
        </div>
        <GoogleFields rgb={rgb} hsl={hsl} hex={hex} hsv={hsv} onChange={onChange} />
      </div>
    </div>
  );
};

export const Google = ColorWrap(GoogleBase);
