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
};
const primitiveBlocks = {
  alphaControl: 'rc-alpha-control',
  checkboard: 'rc-checkboard',
  editableInput: 'rc-editable-input',
  hueControl: 'rc-hue-control',
  raised: 'rc-raised',
  saturation: 'rc-saturation',
  swatch: 'rc-swatch',
};
const defaultElementSlots = ['root', 'body', 'controls', 'field', 'swatch', 'pointer', 'triangle'];
const defaultModifiers = ['light', 'dark', 'disabled-alpha', 'vertical', 'active', 'transparent'];
export const stylingArchitecture = {
  namespace: RC_CLASS_NAMESPACE,
  blocks: Object.assign(Object.assign({}, pickerBlocks), primitiveBlocks),
  defaultElementSlots,
  defaultModifiers,
};
const isNonEmptyToken = (value) => Boolean(value && value.trim().length > 0);
const normalizeToken = (value) => value.trim().replace(/\s+/g, '-');
const joinClassNames = (...values) => {
  const tokens = values.flatMap((value) => (typeof value === 'string' ? value.split(/\s+/).filter(Boolean) : []));
  return tokens.length > 0 ? tokens.join(' ') : undefined;
};
export const getBlockClassName = (block) => stylingArchitecture.blocks[block];
export const getElementClassName = (block, element) => {
  const blockClassName = getBlockClassName(block);
  if (!isNonEmptyToken(element) || element === 'root') {
    return blockClassName;
  }
  return `${blockClassName}__${normalizeToken(element)}`;
};
export const getModifierClassName = (block, modifier) => `${getBlockClassName(block)}--${normalizeToken(modifier)}`;
export const getArchitectureClassName = ({ block, element = 'root', modifiers = [], className }) => {
  var _a;
  return [
    getElementClassName(block, element),
    ...modifiers.filter(isNonEmptyToken).map((modifier) => getModifierClassName(block, modifier)),
    ...((_a = className === null || className === void 0 ? void 0 : className.split(/\s+/).filter(Boolean)) !== null &&
    _a !== void 0
      ? _a
      : []),
  ].join(' ');
};
export const getThemeModifier = (theme) => (theme === 'light' || theme === 'dark' ? theme : undefined);
export const getThemeDataAttributes = (theme) => (theme === 'auto' ? { 'data-theme': 'auto' } : {});
export const getPickerClassName = ({ block, slot = 'root', modifiers = [], className, classNames }) =>
  getArchitectureClassName({
    block,
    element: slot,
    modifiers,
    className: joinClassNames(
      slot === 'root' ? className : undefined,
      classNames === null || classNames === void 0 ? void 0 : classNames[slot],
    ),
  });
export const getPickerRootProps = ({ block, theme, modifiers = [], className, classNames }) =>
  Object.assign(
    {
      className: getPickerClassName({
        block,
        slot: 'root',
        modifiers: [...modifiers, getThemeModifier(theme)],
        className,
        classNames,
      }),
    },
    getThemeDataAttributes(theme),
  );
