import { isValidHex } from '@/helpers/color';
import { ColorWrap, EditableInput, Raised } from '@/components/common';
import { getPickerClassName, getPickerRootProps } from '@/components/common/styleArchitecture';
import { getDeprecatedStyleOverride } from '@/components/common/styleOverrides';
import type {
  ClassName,
  ColorChangeValue,
  ColorInputChangeHandler,
  ColorPickerChangeEvent,
  ColorPickerInjectedProps,
  PickerClassNames,
  PickerCustomStyles,
  PickerTheme,
} from '@/types';

const MATERIAL_STYLE_SLOTS = [
  'material',
  'split',
  'third',
  'HEXwrap',
  'HEXinput',
  'HEXlabel',
  'RGBwrap',
  'RGBinput',
  'RGBlabel',
] as const;

type MaterialProps = ColorPickerInjectedProps & {
  styles?: PickerCustomStyles;
  className?: ClassName;
  classNames?: PickerClassNames;
  theme?: PickerTheme;
};

const handleMaterialChange = (
  onChange: ColorInputChangeHandler,
  rgb: MaterialProps['rgb'],
  data: ColorChangeValue,
  event?: ColorPickerChangeEvent,
) => {
  if (data.hex) {
    if (isValidHex(data.hex)) {
      onChange(
        {
          hex: data.hex,
          source: 'hex',
        },
        event,
      );
    }
  } else if (data.r || data.g || data.b) {
    onChange(
      {
        r: data.r || rgb.r,
        g: data.g || rgb.g,
        b: data.b || rgb.b,
        source: 'rgb',
      },
      event,
    );
  }
};

function MaterialBase({
  onChange,
  hex,
  rgb,
  styles: passedStyles = {},
  className = '',
  classNames,
  theme,
}: MaterialProps) {
  const rootStyle = {
    ['--rc-material-accent' as const]: hex,
    ...getDeprecatedStyleOverride(passedStyles, 'material', MATERIAL_STYLE_SLOTS, 'material'),
  };
  const splitStyle = getDeprecatedStyleOverride(passedStyles, 'split', MATERIAL_STYLE_SLOTS, 'split');
  const thirdStyle = getDeprecatedStyleOverride(passedStyles, 'third', MATERIAL_STYLE_SLOTS, 'third');
  const hexWrapStyle = getDeprecatedStyleOverride(passedStyles, 'HEXwrap', MATERIAL_STYLE_SLOTS, 'HEXwrap');
  const hexInputStyle = getDeprecatedStyleOverride(passedStyles, 'HEXinput', MATERIAL_STYLE_SLOTS, 'HEXinput');
  const hexLabelStyle = getDeprecatedStyleOverride(passedStyles, 'HEXlabel', MATERIAL_STYLE_SLOTS, 'HEXlabel');
  const rgbWrapStyle = getDeprecatedStyleOverride(passedStyles, 'RGBwrap', MATERIAL_STYLE_SLOTS, 'RGBwrap');
  const rgbInputStyle = getDeprecatedStyleOverride(passedStyles, 'RGBinput', MATERIAL_STYLE_SLOTS, 'RGBinput');
  const rgbLabelStyle = getDeprecatedStyleOverride(passedStyles, 'RGBlabel', MATERIAL_STYLE_SLOTS, 'RGBlabel');

  return (
    <Raised styles={passedStyles} theme={theme}>
      <div
        style={rootStyle}
        {...getPickerRootProps({
          block: 'material',
          theme,
          className: `material-picker ${className}`,
          classNames,
        })}
      >
        <EditableInput
          style={{ wrap: hexWrapStyle, input: hexInputStyle, label: hexLabelStyle }}
          label="hex"
          value={hex}
          onChange={(value, event) => handleMaterialChange(onChange, rgb, value as ColorChangeValue, event)}
        />
        <div
          className={getPickerClassName({ block: 'material', slot: 'split', className: 'flexbox-fix' })}
          style={splitStyle}
        >
          <div className={getPickerClassName({ block: 'material', slot: 'third' })} style={thirdStyle}>
            <EditableInput
              style={{ wrap: rgbWrapStyle, input: rgbInputStyle, label: rgbLabelStyle }}
              label="r"
              value={rgb.r}
              onChange={(value, event) => handleMaterialChange(onChange, rgb, value as ColorChangeValue, event)}
            />
          </div>
          <div className={getPickerClassName({ block: 'material', slot: 'third' })} style={thirdStyle}>
            <EditableInput
              style={{ wrap: rgbWrapStyle, input: rgbInputStyle, label: rgbLabelStyle }}
              label="g"
              value={rgb.g}
              onChange={(value, event) => handleMaterialChange(onChange, rgb, value as ColorChangeValue, event)}
            />
          </div>
          <div className={getPickerClassName({ block: 'material', slot: 'third' })} style={thirdStyle}>
            <EditableInput
              style={{ wrap: rgbWrapStyle, input: rgbInputStyle, label: rgbLabelStyle }}
              label="b"
              value={rgb.b}
              onChange={(value, event) => handleMaterialChange(onChange, rgb, value as ColorChangeValue, event)}
            />
          </div>
        </div>
      </div>
    </Raised>
  );
}

export const Material = ColorWrap(MaterialBase);
