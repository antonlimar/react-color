import map from 'lodash/map';
import * as color from '../../helpers/color';

import { ColorWrap, EditableInput, Swatch } from '../common';
import { getPickerClassName, getPickerRootProps } from '../common/styleArchitecture';
import { getDeprecatedStyleOverride } from '../common/styleOverrides';
import type {
  ClassName,
  ColorInputChangeHandler,
  ColorPickerChangeEvent,
  ColorPickerInjectedProps,
  PickerClassNames,
  PickerCustomStyles,
  PickerTheme,
} from '../../types';

const TWITTER_STYLE_SLOTS = ['card', 'body', 'triangle', 'triangleShadow', 'hash', 'input', 'swatch'] as const;

type TwitterProps = ColorPickerInjectedProps & {
  colors?: string[];
  width?: string | number;
  triangle?: 'hide' | 'top-left' | 'top-right';
  styles?: PickerCustomStyles;
  className?: ClassName;
  classNames?: PickerClassNames;
  theme?: PickerTheme;
};

const DEFAULT_TWITTER_COLORS = [
  '#FF6900',
  '#FCB900',
  '#7BDCB5',
  '#00D084',
  '#8ED1FC',
  '#0693E3',
  '#ABB8C3',
  '#EB144C',
  '#F78DA7',
  '#9900EF',
];

const handleHexChange = (onChange: ColorInputChangeHandler, hexCode: string, event?: ColorPickerChangeEvent) => {
  if (color.isValidHex(hexCode)) {
    onChange(
      {
        hex: hexCode,
        source: 'hex',
      },
      event,
    );
  }
};

export const Twitter = ({
  onChange,
  onSwatchHover,
  hex,
  colors = DEFAULT_TWITTER_COLORS,
  width = 276,
  triangle = 'top-left',
  styles: passedStyles = {},
  className = '',
  classNames,
  theme,
}: TwitterProps) => {
  const rootStyle = {
    width,
    ...getDeprecatedStyleOverride(passedStyles, 'card', TWITTER_STYLE_SLOTS, 'card'),
  };
  const bodyStyle = getDeprecatedStyleOverride(passedStyles, 'body', TWITTER_STYLE_SLOTS, 'body');
  const triangleStyle = getDeprecatedStyleOverride(passedStyles, 'triangle', TWITTER_STYLE_SLOTS, 'triangle');
  const triangleShadowStyle = getDeprecatedStyleOverride(
    passedStyles,
    'triangleShadow',
    TWITTER_STYLE_SLOTS,
    'triangleShadow',
  );
  const hashStyle = getDeprecatedStyleOverride(passedStyles, 'hash', TWITTER_STYLE_SLOTS, 'hash');
  const inputStyle = getDeprecatedStyleOverride(passedStyles, 'input', TWITTER_STYLE_SLOTS, 'input');
  const swatchStyle = getDeprecatedStyleOverride(passedStyles, 'swatch', TWITTER_STYLE_SLOTS, 'swatch');

  return (
    <div
      style={rootStyle}
      {...getPickerRootProps({
        block: 'twitter',
        theme,
        modifiers: [triangle === 'hide' && 'hide-triangle', triangle],
        className: `twitter-picker ${className}`,
        classNames,
      })}
    >
      <div className={getPickerClassName({ block: 'twitter', slot: 'triangle-shadow' })} style={triangleShadowStyle} />
      <div className={getPickerClassName({ block: 'twitter', slot: 'triangle' })} style={triangleStyle} />

      <div className={getPickerClassName({ block: 'twitter', slot: 'body' })} style={bodyStyle}>
        {map(colors, (colorValue: string, index: number | string) => (
          <div key={index} className={getPickerClassName({ block: 'twitter', slot: 'swatch' })}>
            <Swatch
              color={colorValue}
              style={swatchStyle}
              onClick={(hexCode, event) => handleHexChange(onChange, hexCode, event)}
              onHover={onSwatchHover as never}
              focusStyle={{
                boxShadow: `0 0 4px ${colorValue}`,
              }}
            />
          </div>
        ))}
        <div className={getPickerClassName({ block: 'twitter', slot: 'hash' })} style={hashStyle}>
          #
        </div>
        <EditableInput
          label={null}
          style={{ input: inputStyle }}
          value={hex.replace('#', '')}
          onChange={(value, event) => handleHexChange(onChange, String(value), event)}
        />
        <div className={getPickerClassName({ block: 'twitter', slot: 'clear' })} />
      </div>
    </div>
  );
};

export default ColorWrap(Twitter);
