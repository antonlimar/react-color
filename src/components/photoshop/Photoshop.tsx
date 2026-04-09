import { useState } from 'react';
import reactCSS from 'reactcss';
import merge from 'lodash/merge';

import { ColorWrap, Saturation, Hue } from '../common';
import { getPickerRootProps } from '../common/styleArchitecture';
import PhotoshopFields from './PhotoshopFields';
import PhotoshopPointerCircle from './PhotoshopPointerCircle';
import PhotoshopPointer from './PhotoshopPointer';
import PhotoshopButton from './PhotoshopButton';
import PhotoshopPreviews from './PhotoshopPreviews';
import type {
  ClassName,
  ColorPickerInjectedProps,
  ColorPickerProps,
  PickerClassNames,
  PickerCustomStyles,
  PickerTheme,
} from '../../types';

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

export const Photoshop = (props: PhotoshopProps) => {
  const [currentColor] = useState(props.hex);

  const resolvedProps: PhotoshopProps = {
    ...props,
    header: props.header ?? defaultHeader,
    styles: props.styles ?? defaultStyles,
  };
  const { styles: passedStyles, className = '', classNames, theme } = resolvedProps;

  const styles = reactCSS(
    merge(
      {
        default: {
          picker: {
            background: '#DCDCDC',
            borderRadius: '4px',
            boxShadow: '0 0 0 1px rgba(0,0,0,.25), 0 8px 16px rgba(0,0,0,.15)',
            boxSizing: 'initial',
            width: '513px',
          },
          head: {
            backgroundImage: 'linear-gradient(-180deg, #F0F0F0 0%, #D4D4D4 100%)',
            borderBottom: '1px solid #B1B1B1',
            boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,.2), inset 0 -1px 0 0 rgba(0,0,0,.02)',
            height: '23px',
            lineHeight: '24px',
            borderRadius: '4px 4px 0 0',
            fontSize: '13px',
            color: '#4D4D4D',
            textAlign: 'center',
          },
          body: {
            padding: '15px 15px 0',
            display: 'flex',
          },
          saturation: {
            width: '256px',
            height: '256px',
            position: 'relative',
            border: '2px solid #B3B3B3',
            borderBottom: '2px solid #F0F0F0',
            overflow: 'hidden',
          },
          hue: {
            position: 'relative',
            height: '256px',
            width: '19px',
            marginLeft: '10px',
            border: '2px solid #B3B3B3',
            borderBottom: '2px solid #F0F0F0',
          },
          controls: {
            width: '180px',
            marginLeft: '10px',
          },
          top: {
            display: 'flex',
          },
          previews: {
            width: '60px',
          },
          actions: {
            flex: '1',
            marginLeft: '20px',
          },
        },
      },
      passedStyles,
    ),
  );

  return (
    <div
      style={styles.picker}
      {...getPickerRootProps({
        block: 'photoshop',
        theme,
        className: `photoshop-picker ${className}`,
        classNames,
      })}
    >
      <div style={styles.head}>{resolvedProps.header}</div>

      <div style={styles.body} className="flexbox-fix">
        <div style={styles.saturation}>
          <Saturation
            hsl={resolvedProps.hsl}
            hsv={resolvedProps.hsv}
            pointer={PhotoshopPointerCircle}
            onChange={resolvedProps.onChange}
          />
        </div>
        <div style={styles.hue}>
          <Hue
            direction="vertical"
            hsl={resolvedProps.hsl}
            pointer={PhotoshopPointer}
            onChange={resolvedProps.onChange}
          />
        </div>
        <div style={styles.controls}>
          <div style={styles.top} className="flexbox-fix">
            <div style={styles.previews}>
              <PhotoshopPreviews rgb={resolvedProps.rgb} currentColor={currentColor} />
            </div>
            <div style={styles.actions}>
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

export default ColorWrap(Photoshop);
