import { isValidHex } from '@/helpers';
import {
  ColorWrap,
  EditableInput,
  Swatch,
  bem,
  getThemeDataAttributes,
  getDeprecatedStyleOverride,
} from '@/components/common';
import './Twitter.scss';

import type {
  ClassName,
  ColorInputChangeHandler,
  ColorPickerChangeEvent,
  ColorPickerInjectedProps,
  PickerClassNames,
  PickerCustomStyles,
  PickerTheme,
} from '@/types';

const b = bem('twitter');

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
  if (isValidHex(hexCode)) {
    onChange(
      {
        hex: hexCode,
        source: 'hex',
      },
      event,
    );
  }
};

function TwitterBase({
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
}: TwitterProps) {
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
      className={b({
        'hide-triangle': triangle === 'hide',
        [triangle]: true,
        dark: theme === 'dark',
        light: theme === 'light',
      })
        .mix('twitter-picker', className, classNames?.root)
        .toString()}
      {...getThemeDataAttributes(theme)}
    >
      <div className={b('triangle-shadow').toString()} style={triangleShadowStyle} />
      <div className={b('triangle').toString()} style={triangleStyle} />

      <div className={b('body').toString()} style={bodyStyle}>
        {colors.map((colorValue: string, index: number | string) => (
          <div key={index} className={b('swatch').toString()}>
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
        <div className={b('hash').toString()} style={hashStyle}>
          #
        </div>
        <EditableInput
          label={null}
          style={{ input: inputStyle }}
          value={hex.replace('#', '')}
          onChange={(value, event) => handleHexChange(onChange, String(value), event)}
        />
        <div className={b('clear').toString()} />
      </div>
    </div>
  );
}

export const Twitter = ColorWrap(TwitterBase);
