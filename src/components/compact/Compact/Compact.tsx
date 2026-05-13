import { isValidHex } from '@/helpers/color';
import { ColorWrap, Raised } from '@/components/common';
import { bem, getThemeDataAttributes } from '@/components/common/styleArchitecture';
import { getDeprecatedStyleOverride } from '@/components/common/styleOverrides';
import { CompactColor } from '@/components/compact/CompactColor';
import { CompactFields } from '@/components/compact/CompactFields';
import './Compact.scss';

import type {
  ClassName,
  ColorChangeValue,
  ColorPickerChangeEvent,
  ColorPickerInjectedProps,
  PickerClassNames,
  PickerCustomStyles,
  PickerTheme,
} from '@/types';

const b = bem('compact');

const COMPACT_STYLE_SLOTS = ['Compact', 'compact', 'clear'] as const;

type CompactProps = ColorPickerInjectedProps & {
  colors?: string[];
  styles?: PickerCustomStyles;
  className?: ClassName;
  classNames?: PickerClassNames;
  theme?: PickerTheme;
};

const handleCompactChange = (
  onChange: CompactProps['onChange'],
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
  } else {
    onChange(data, event);
  }
};

const DEFAULT_COMPACT_COLORS = [
  '#4D4D4D',
  '#999999',
  '#FFFFFF',
  '#F44E3B',
  '#FE9200',
  '#FCDC00',
  '#DBDF00',
  '#A4DD00',
  '#68CCCA',
  '#73D8FF',
  '#AEA1FF',
  '#FDA1FF',
  '#333333',
  '#808080',
  '#cccccc',
  '#D33115',
  '#E27300',
  '#FCC400',
  '#B0BC00',
  '#68BC00',
  '#16A5A5',
  '#009CE0',
  '#7B64FF',
  '#FA28FF',
  '#000000',
  '#666666',
  '#B3B3B3',
  '#9F0500',
  '#C45100',
  '#FB9E00',
  '#808900',
  '#194D33',
  '#0C797D',
  '#0062B1',
  '#653294',
  '#AB149E',
];

function CompactBase({
  onChange,
  onSwatchHover,
  colors = DEFAULT_COMPACT_COLORS,
  hex,
  rgb,
  styles: passedStyles = {},
  className = '',
  classNames,
  theme,
}: CompactProps) {
  const raisedStyle = getDeprecatedStyleOverride(passedStyles, 'Compact', COMPACT_STYLE_SLOTS, 'Compact');
  const rootStyle = getDeprecatedStyleOverride(passedStyles, 'compact', COMPACT_STYLE_SLOTS, 'compact');
  const clearStyle = getDeprecatedStyleOverride(passedStyles, 'clear', COMPACT_STYLE_SLOTS, 'clear');

  return (
    <Raised style={raisedStyle} styles={passedStyles} theme={theme}>
      <div
        style={rootStyle}
        className={b({ dark: theme === 'dark', light: theme === 'light' })
          .mix('compact-picker', className, classNames?.root)
          .toString()}
        {...getThemeDataAttributes(theme)}
      >
        <div className={b('swatches').toString()}>
          {colors.map((colorValue: string) => (
            <CompactColor
              key={colorValue}
              color={colorValue}
              active={colorValue.toLowerCase() === hex}
              onClick={(swatchColor, event) => handleCompactChange(onChange, { hex: swatchColor }, event)}
              onSwatchHover={onSwatchHover}
            />
          ))}
          <div className={b('clear').toString()} style={clearStyle} />
        </div>
        <CompactFields hex={hex} rgb={rgb} onChange={(data, event) => handleCompactChange(onChange, data, event)} />
      </div>
    </Raised>
  );
}

export const Compact = ColorWrap(CompactBase);
