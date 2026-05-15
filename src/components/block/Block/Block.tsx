import { getContrastingColor, isValidHex } from '@/helpers';
import {
  ColorWrap,
  EditableInput,
  Checkboard,
  bem,
  getThemeDataAttributes,
  getDeprecatedStyleOverride,
} from '@/components/common';
import { BlockSwatches } from '@/components/block/BlockSwatches';
import './Block.scss';

import type {
  ClassName,
  ColorInputChangeHandler,
  ColorPickerChangeEvent,
  ColorPickerInjectedProps,
  PickerClassNames,
  PickerCustomStyles,
  PickerTheme,
} from '@/types';

const b = bem('block');

const BLOCK_STYLE_SLOTS = ['card', 'triangle', 'head', 'label', 'body', 'input'] as const;

type BlockProps = ColorPickerInjectedProps & {
  colors?: string[];
  width?: string | number;
  triangle?: 'top' | 'hide';
  styles?: PickerCustomStyles;
  className?: ClassName;
  classNames?: PickerClassNames;
  theme?: PickerTheme;
};

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

function BlockBase({
  onChange,
  onSwatchHover,
  hex,
  colors = ['#D9E3F0', '#F47373', '#697689', '#37D67A', '#2CCCE4', '#555555', '#dce775', '#ff8a65', '#ba68c8'],
  width = 170,
  triangle = 'top',
  styles: passedStyles = {},
  className = '',
  classNames,
  theme,
}: BlockProps) {
  const transparent = hex === 'transparent';
  const rootStyle = {
    width,
    ...getDeprecatedStyleOverride(passedStyles, 'card', BLOCK_STYLE_SLOTS, 'card'),
  };
  const triangleStyle = {
    borderColor: `transparent transparent ${hex} transparent`,
    ...getDeprecatedStyleOverride(passedStyles, 'triangle', BLOCK_STYLE_SLOTS, 'triangle'),
  };
  const headStyle = {
    background: hex,
    ...getDeprecatedStyleOverride(passedStyles, 'head', BLOCK_STYLE_SLOTS, 'head'),
  };
  const labelStyle = {
    color: getContrastingColor(hex),
    ...getDeprecatedStyleOverride(passedStyles, 'label', BLOCK_STYLE_SLOTS, 'label'),
  };
  const bodyStyle = getDeprecatedStyleOverride(passedStyles, 'body', BLOCK_STYLE_SLOTS, 'body');
  const inputStyle = getDeprecatedStyleOverride(passedStyles, 'input', BLOCK_STYLE_SLOTS, 'input');

  return (
    <div
      style={rootStyle}
      className={b({
        'hide-triangle': triangle === 'hide',
        dark: theme === 'dark',
        light: theme === 'light',
      })
        .mix('block-picker', className, classNames?.root)
        .toString()}
      {...getThemeDataAttributes(theme)}
    >
      <div className={b('triangle').toString()} style={triangleStyle} />

      <div className={b('head', { transparent }).toString()} style={headStyle}>
        {transparent ? <Checkboard borderRadius="6px 6px 0 0" /> : null}
        <div className={b('label').toString()} style={labelStyle}>
          {hex}
        </div>
      </div>

      <div className={b('body').toString()} style={bodyStyle}>
        <BlockSwatches
          colors={colors!}
          onClick={(hexCode, event) => handleHexChange(onChange, hexCode, event)}
          onSwatchHover={onSwatchHover}
        />
        <EditableInput
          style={{ input: inputStyle }}
          value={hex}
          onChange={(value, event) => handleHexChange(onChange, String(value), event)}
        />
      </div>
    </div>
  );
}

export const Block = ColorWrap(BlockBase);
