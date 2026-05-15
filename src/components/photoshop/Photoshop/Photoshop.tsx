import { useState } from 'react';
import {
  ColorWrap,
  Saturation,
  Hue,
  bem,
  getThemeDataAttributes,
  getDeprecatedStyleOverride,
} from '@/components/common';
import type {
  ClassName,
  ColorPickerInjectedProps,
  ColorPickerProps,
  PickerClassNames,
  PickerCustomStyles,
  PickerTheme,
} from '@/types';
import { PhotoshopButton } from '../PhotoshopButton';
import { PhotoshopFields } from '../PhotoshopFields';
import { PhotoshopPointer } from '../PhotoshopPointer';
import { PhotoshopPointerCircle } from '../PhotoshopPointerCircle';
import { PhotoshopPreviews } from '../PhotoshopPreviews';
import './Photoshop.scss';

type PhotoshopProps = ColorPickerInjectedProps & {
  header?: string;
  styles?: PickerCustomStyles;
  className?: ClassName;
  classNames?: PickerClassNames;
  theme?: PickerTheme;
  onAccept?: ColorPickerProps['onChange'];
  onCancel?: () => void;
};

const b = bem('photoshop');

const defaultHeader = 'Color Picker';
const defaultStyles: PickerCustomStyles = {};
const PHOTOSHOP_STYLE_SLOTS = [
  'picker',
  'head',
  'body',
  'saturation',
  'hue',
  'controls',
  'top',
  'previews',
  'actions',
] as const;

function PhotoshopBase(props: PhotoshopProps) {
  const [currentColor] = useState(props.hex);

  const resolvedProps: PhotoshopProps = {
    ...props,
    header: props.header ?? defaultHeader,
    styles: props.styles ?? defaultStyles,
  };
  const { styles: passedStyles, className = '', classNames, theme } = resolvedProps;
  const rootStyle = getDeprecatedStyleOverride(passedStyles, 'picker', PHOTOSHOP_STYLE_SLOTS, 'picker');
  const headStyle = getDeprecatedStyleOverride(passedStyles, 'head', PHOTOSHOP_STYLE_SLOTS, 'head');
  const bodyStyle = getDeprecatedStyleOverride(passedStyles, 'body', PHOTOSHOP_STYLE_SLOTS, 'body');
  const saturationStyle = getDeprecatedStyleOverride(passedStyles, 'saturation', PHOTOSHOP_STYLE_SLOTS, 'saturation');
  const hueStyle = getDeprecatedStyleOverride(passedStyles, 'hue', PHOTOSHOP_STYLE_SLOTS, 'hue');
  const controlsStyle = getDeprecatedStyleOverride(passedStyles, 'controls', PHOTOSHOP_STYLE_SLOTS, 'controls');
  const topStyle = getDeprecatedStyleOverride(passedStyles, 'top', PHOTOSHOP_STYLE_SLOTS, 'top');
  const previewsStyle = getDeprecatedStyleOverride(passedStyles, 'previews', PHOTOSHOP_STYLE_SLOTS, 'previews');
  const actionsStyle = getDeprecatedStyleOverride(passedStyles, 'actions', PHOTOSHOP_STYLE_SLOTS, 'actions');

  return (
    <div
      style={rootStyle}
      className={b({ dark: theme === 'dark', light: theme === 'light' }).mix(
        'photoshop-picker',
        className,
        classNames?.root,
      )}
      {...getThemeDataAttributes(theme)}
    >
      <div className={b('head')} style={headStyle}>
        {resolvedProps.header}
      </div>

      <div className={b('body')} style={bodyStyle}>
        <div className={b('saturation')} style={saturationStyle}>
          <Saturation
            hsl={resolvedProps.hsl}
            hsv={resolvedProps.hsv}
            pointer={PhotoshopPointerCircle}
            onChange={resolvedProps.onChange}
          />
        </div>
        <div className={b('hue')} style={hueStyle}>
          <Hue
            direction="vertical"
            hsl={resolvedProps.hsl}
            pointer={PhotoshopPointer}
            onChange={resolvedProps.onChange}
          />
        </div>
        <div className={b('controls')} style={controlsStyle}>
          <div className={b('top')} style={topStyle}>
            <div className={b('previews')} style={previewsStyle}>
              <PhotoshopPreviews rgb={resolvedProps.rgb} currentColor={currentColor} />
            </div>
            <div className={b('actions')} style={actionsStyle}>
              <PhotoshopButton label="OK" onClick={() => resolvedProps.onAccept?.(resolvedProps, undefined)} active />
              <PhotoshopButton label="Cancel" onClick={resolvedProps.onCancel} />
              <PhotoshopFields
                onChange={resolvedProps.onChange}
                rgb={resolvedProps.rgb}
                hsv={resolvedProps.hsv}
                hex={resolvedProps.hex}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Photoshop = ColorWrap(PhotoshopBase);
