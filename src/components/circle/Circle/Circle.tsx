/* eslint-disable import-x/no-named-as-default-member */
import material from 'material-colors';
import './Circle.scss';
import { CircleSwatch } from '@/components/circle/CircleSwatch';
import { ColorWrap, bem, getThemeDataAttributes, getDeprecatedStyleOverride } from '@/components/common';
import type { ClassName, ColorPickerInjectedProps, PickerClassNames, PickerCustomStyles, PickerTheme } from '@/types';

const b = bem('circle');

const CIRCLE_STYLE_SLOTS = ['card'] as const;

type CircleProps = ColorPickerInjectedProps & {
  width?: string | number;
  circleSize?: number;
  circleSpacing?: number;
  colors?: string[];
  styles?: PickerCustomStyles;
  className?: ClassName;
  classNames?: PickerClassNames;
  theme?: PickerTheme;
};

const DEFAULT_CIRCLE_COLORS = [
  material.red['500'],
  material.pink['500'],
  material.purple['500'],
  material.deepPurple['500'],
  material.indigo['500'],
  material.blue['500'],
  material.lightBlue['500'],
  material.cyan['500'],
  material.teal['500'],
  material.green['500'],
  material.lightGreen['500'],
  material.lime['500'],
  material.yellow['500'],
  material.amber['500'],
  material.orange['500'],
  material.deepOrange['500'],
  material.brown['500'],
  material.blueGrey['500'],
];

function CircleBase({
  width = 252,
  onChange,
  onSwatchHover,
  colors = DEFAULT_CIRCLE_COLORS,
  hex,
  circleSize = 28,
  styles: passedStyles = {},
  circleSpacing = 14,
  className = '',
  classNames,
  theme,
}: CircleProps) {
  const rootStyle = {
    width,
    marginRight: -circleSpacing,
    marginBottom: -circleSpacing,
    ...getDeprecatedStyleOverride(passedStyles, 'card', CIRCLE_STYLE_SLOTS, 'card'),
  };

  return (
    <div
      style={rootStyle}
      className={b({ dark: theme === 'dark', light: theme === 'light' })
        .mix('circle-picker', className, classNames?.root)
        .toString()}
      {...getThemeDataAttributes(theme)}
    >
      {colors.map((colorValue: string) => (
        <CircleSwatch
          key={colorValue}
          color={colorValue}
          onClick={(hexCode, event) => onChange({ hex: hexCode, source: 'hex' }, event)}
          onSwatchHover={onSwatchHover}
          active={hex === colorValue.toLowerCase()}
          circleSize={circleSize}
          circleSpacing={circleSpacing}
        />
      ))}
    </div>
  );
}

export const Circle = ColorWrap(CircleBase);
