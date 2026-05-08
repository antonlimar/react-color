import * as color from '@/helpers/color';

import { ColorWrap, EditableInput, Checkboard } from '@/components/common';
import { getPickerClassName, getPickerRootProps } from '@/components/common/styleArchitecture';
import { getDeprecatedStyleOverride } from '@/components/common/styleOverrides';
import { BlockSwatches } from '@/components/block/BlockSwatches';
import type {
  ClassName,
  ColorInputChangeHandler,
  ColorPickerChangeEvent,
  ColorPickerInjectedProps,
  PickerClassNames,
  PickerCustomStyles,
  PickerTheme,
} from '@/types';

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
    color: color.getContrastingColor(hex),
    ...getDeprecatedStyleOverride(passedStyles, 'label', BLOCK_STYLE_SLOTS, 'label'),
  };
  const bodyStyle = getDeprecatedStyleOverride(passedStyles, 'body', BLOCK_STYLE_SLOTS, 'body');
  const inputStyle = getDeprecatedStyleOverride(passedStyles, 'input', BLOCK_STYLE_SLOTS, 'input');

  return (
    <div
      style={rootStyle}
      {...getPickerRootProps({
        block: 'block',
        theme,
        modifiers: [triangle === 'hide' && 'hide-triangle'],
        className: `block-picker ${className}`,
        classNames,
      })}
    >
      <div className={getPickerClassName({ block: 'block', slot: 'triangle' })} style={triangleStyle} />

      <div
        className={getPickerClassName({
          block: 'block',
          slot: 'head',
          modifiers: [transparent && 'transparent'],
        })}
        style={headStyle}
      >
        {transparent ? <Checkboard borderRadius="6px 6px 0 0" /> : null}
        <div className={getPickerClassName({ block: 'block', slot: 'label' })} style={labelStyle}>
          {hex}
        </div>
      </div>

      <div className={getPickerClassName({ block: 'block', slot: 'body' })} style={bodyStyle}>
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
