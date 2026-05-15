import { ColorWrap, bem, getThemeDataAttributes, getDeprecatedStyleOverride } from '@/components/common';
import type { ClassName, ColorPickerInjectedProps, PickerClassNames, PickerCustomStyles, PickerTheme } from '@/types';
import { GithubSwatch } from '../GithubSwatch';
import './Github.scss';

type GithubProps = ColorPickerInjectedProps & {
  width?: string | number;
  colors?: string[];
  triangle?: 'hide' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  styles?: PickerCustomStyles;
  className?: ClassName;
  classNames?: PickerClassNames;
  theme?: PickerTheme;
};

const b = bem('github');

const GITHUB_STYLE_SLOTS = ['card', 'triangle', 'triangleShadow'] as const;

const DEFAULT_GITHUB_COLORS = [
  '#B80000',
  '#DB3E00',
  '#FCCB00',
  '#008B02',
  '#006B76',
  '#1273DE',
  '#004DCF',
  '#5300EB',
  '#EB9694',
  '#FAD0C3',
  '#FEF3BD',
  '#C1E1C5',
  '#BEDADC',
  '#C4DEF6',
  '#BED3F3',
  '#D4C4FB',
];

function GithubBase({
  width = 200,
  colors = DEFAULT_GITHUB_COLORS,
  onChange,
  onSwatchHover,
  triangle = 'top-left',
  styles: passedStyles = {},
  className = '',
  classNames,
  theme,
}: GithubProps) {
  const rootStyle = {
    width,
    ...getDeprecatedStyleOverride(passedStyles, 'card', GITHUB_STYLE_SLOTS, 'card'),
  };
  const triangleStyle = getDeprecatedStyleOverride(passedStyles, 'triangle', GITHUB_STYLE_SLOTS, 'triangle');
  const triangleShadowStyle = getDeprecatedStyleOverride(
    passedStyles,
    'triangleShadow',
    GITHUB_STYLE_SLOTS,
    'triangleShadow',
  );

  return (
    <div
      style={rootStyle}
      className={b({
        'hide-triangle': triangle === 'hide',
        [triangle]: true,
        dark: theme === 'dark',
        light: theme === 'light',
      }).mix('github-picker', className, classNames?.root)}
      {...getThemeDataAttributes(theme)}
    >
      <div className={b('triangle-shadow')} style={triangleShadowStyle} />
      <div className={b('triangle')} style={triangleStyle} />
      {colors.map((colorValue: string) => (
        <GithubSwatch
          color={colorValue}
          key={colorValue}
          onClick={(hexCode, event) => onChange({ hex: hexCode, source: 'hex' }, event)}
          onSwatchHover={onSwatchHover}
        />
      ))}
    </div>
  );
}

export const Github = ColorWrap(GithubBase);
