import { setup } from 'bem-cn';

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

const createBem = setup({
  el: '__',
  mod: '--',
  modValue: '-',
});

export const bem = (block: StylingArchitectureBlock) => createBem(stylingArchitecture.blocks[block]);

export const getThemeDataAttributes = (theme?: 'light' | 'dark' | 'auto'): { 'data-theme'?: 'auto' } =>
  theme === 'auto' ? { 'data-theme': 'auto' } : {};
