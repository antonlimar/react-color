const RC_CLASS_NAMESPACE = 'rc';

const pickerBlocks = {
  alpha: 'rc-alpha',
  block: 'rc-block',
  chrome: 'rc-chrome',
  circle: 'rc-circle',
  compact: 'rc-compact',
  github: 'rc-github',
  google: 'rc-google',
  hue: 'rc-hue',
  material: 'rc-material',
  photoshop: 'rc-photoshop',
  sketch: 'rc-sketch',
  slider: 'rc-slider',
  swatches: 'rc-swatches',
  twitter: 'rc-twitter',
} as const;

const primitiveBlocks = {
  alphaControl: 'rc-alpha-control',
  checkboard: 'rc-checkboard',
  editableInput: 'rc-editable-input',
  hueControl: 'rc-hue-control',
  raised: 'rc-raised',
  saturation: 'rc-saturation',
  swatch: 'rc-swatch',
} as const;

const defaultElementSlots = ['root', 'body', 'controls', 'field', 'swatch', 'pointer', 'triangle'] as const;
const defaultModifiers = ['light', 'dark', 'disabled-alpha', 'vertical', 'active', 'transparent'] as const;

export const stylingArchitecture = {
  namespace: RC_CLASS_NAMESPACE,
  blocks: {
    ...pickerBlocks,
    ...primitiveBlocks,
  },
  defaultElementSlots,
  defaultModifiers,
} as const;

export type StylingArchitectureBlock = keyof typeof stylingArchitecture.blocks;
export type StylingArchitectureElement = (typeof defaultElementSlots)[number];
export type StylingArchitectureModifier = (typeof defaultModifiers)[number];

const isNonEmptyToken = (value: string | false | null | undefined): value is string =>
  Boolean(value && value.trim().length > 0);

const normalizeToken = (value: string): string => value.trim().replace(/\s+/g, '-');

const joinClassNames = (...values: Array<string | null | undefined | false>): string | undefined => {
  const tokens = values.reduce<string[]>((acc, value) => {
    if (typeof value === 'string') {
      acc.push(...value.split(/\s+/).filter(Boolean));
    }

    return acc;
  }, []);

  return tokens.length > 0 ? tokens.join(' ') : undefined;
};

export const getBlockClassName = (block: StylingArchitectureBlock): string => stylingArchitecture.blocks[block];

export const getElementClassName = (
  block: StylingArchitectureBlock,
  element?: StylingArchitectureElement | string,
): string => {
  const blockClassName = getBlockClassName(block);

  if (!isNonEmptyToken(element) || element === 'root') {
    return blockClassName;
  }

  return `${blockClassName}__${normalizeToken(element)}`;
};

export const getModifierClassName = (
  block: StylingArchitectureBlock,
  modifier: StylingArchitectureModifier | string,
): string => `${getBlockClassName(block)}--${normalizeToken(modifier)}`;

export const getArchitectureClassName = ({
  block,
  element = 'root',
  modifiers = [],
  className,
}: {
  block: StylingArchitectureBlock;
  element?: StylingArchitectureElement | string;
  modifiers?: Array<StylingArchitectureModifier | string | false | null | undefined>;
  className?: string;
}): string =>
  [
    getElementClassName(block, element),
    ...modifiers.filter(isNonEmptyToken).map((modifier) => getModifierClassName(block, modifier)),
    ...(className?.split(/\s+/).filter(Boolean) ?? []),
  ].join(' ');

export const getThemeModifier = (theme?: 'light' | 'dark' | 'auto'): 'light' | 'dark' | undefined =>
  theme === 'light' || theme === 'dark' ? theme : undefined;

export const getThemeDataAttributes = (theme?: 'light' | 'dark' | 'auto'): { 'data-theme'?: 'auto' } =>
  theme === 'auto' ? { 'data-theme': 'auto' } : {};

export const getPickerClassName = ({
  block,
  slot = 'root',
  modifiers = [],
  className,
  classNames,
}: {
  block: StylingArchitectureBlock;
  slot?: StylingArchitectureElement | string;
  modifiers?: Array<StylingArchitectureModifier | string | false | null | undefined>;
  className?: string;
  classNames?: Partial<Record<string, string | undefined>>;
}): string =>
  getArchitectureClassName({
    block,
    element: slot,
    modifiers,
    className: joinClassNames(slot === 'root' ? className : undefined, classNames?.[slot]),
  });

export const getPickerRootProps = ({
  block,
  theme,
  modifiers = [],
  className,
  classNames,
}: {
  block: StylingArchitectureBlock;
  theme?: 'light' | 'dark' | 'auto';
  modifiers?: Array<StylingArchitectureModifier | string | false | null | undefined>;
  className?: string;
  classNames?: Partial<Record<string, string | undefined>>;
}): { className: string; 'data-theme'?: 'auto' } => ({
  className: getPickerClassName({
    block,
    slot: 'root',
    modifiers: [...modifiers, getThemeModifier(theme)],
    className,
    classNames,
  }),
  ...getThemeDataAttributes(theme),
});
