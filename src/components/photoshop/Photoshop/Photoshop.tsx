import { useState } from 'react';

import { ColorWrap, Saturation, Hue } from '@/components/common';
import { getPickerClassName, getPickerRootProps } from '@/components/common/styleArchitecture';
import { getDeprecatedStyleOverride } from '@/components/common/styleOverrides';
import { PhotoshopFields } from '@/components/photoshop/PhotoshopFields';
import { PhotoshopPointerCircle } from '@/components/photoshop/PhotoshopPointerCircle';
import { PhotoshopPointer } from '@/components/photoshop/PhotoshopPointer';
import { PhotoshopButton } from '@/components/photoshop/PhotoshopButton';
import { PhotoshopPreviews } from '@/components/photoshop/PhotoshopPreviews';
import type {
  ClassName,
  ColorPickerInjectedProps,
  ColorPickerProps,
  PickerClassNames,
  PickerCustomStyles,
  PickerTheme,
} from '@/types';

type PhotoshopProps = ColorPickerInjectedProps & {
  header?: string;
  styles?: PickerCustomStyles;
  className?: ClassName;
  classNames?: PickerClassNames;
  theme?: PickerTheme;
  onAccept?: ColorPickerProps['onChange'];
  onCancel?: () => void;
};

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

const PhotoshopBase = (props: PhotoshopProps) => {
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
      {...getPickerRootProps({
        block: 'photoshop',
        theme,
        className: `photoshop-picker ${className}`,
        classNames,
      })}
    >
      <div className={getPickerClassName({ block: 'photoshop', slot: 'head' })} style={headStyle}>
        {resolvedProps.header}
      </div>

      <div
        className={getPickerClassName({ block: 'photoshop', slot: 'body', className: 'flexbox-fix' })}
        style={bodyStyle}
      >
        <div className={getPickerClassName({ block: 'photoshop', slot: 'saturation' })} style={saturationStyle}>
          <Saturation
            hsl={resolvedProps.hsl}
            hsv={resolvedProps.hsv}
            pointer={PhotoshopPointerCircle}
            onChange={resolvedProps.onChange}
          />
        </div>
        <div className={getPickerClassName({ block: 'photoshop', slot: 'hue' })} style={hueStyle}>
          <Hue
            direction="vertical"
            hsl={resolvedProps.hsl}
            pointer={PhotoshopPointer}
            onChange={resolvedProps.onChange}
          />
        </div>
        <div className={getPickerClassName({ block: 'photoshop', slot: 'controls' })} style={controlsStyle}>
          <div
            className={getPickerClassName({ block: 'photoshop', slot: 'top', className: 'flexbox-fix' })}
            style={topStyle}
          >
            <div className={getPickerClassName({ block: 'photoshop', slot: 'previews' })} style={previewsStyle}>
              <PhotoshopPreviews rgb={resolvedProps.rgb} currentColor={currentColor} />
            </div>
            <div className={getPickerClassName({ block: 'photoshop', slot: 'actions' })} style={actionsStyle}>
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
};

export const Photoshop = ColorWrap(PhotoshopBase);
