import { jsx as _jsx } from 'react/jsx-runtime';
import { cloneElement, isValidElement } from 'react';
import reactCSS from 'reactcss';
import * as checkboard from '../../helpers/checkboard';
export const Checkboard = ({
  white = 'transparent',
  grey = 'rgba(0,0,0,.08)',
  size = 8,
  renderers = {},
  borderRadius,
  boxShadow,
  children,
}) => {
  const styles = reactCSS({
    default: {
      grid: {
        borderRadius,
        boxShadow,
        absolute: '0px 0px 0px 0px',
        background: `url(${checkboard.get(white, grey, size, renderers === null || renderers === void 0 ? void 0 : renderers.canvas)}) center left`,
      },
    },
  });
  if (isValidElement(children)) {
    const child = children;
    return cloneElement(
      child,
      Object.assign(Object.assign({}, child.props), {
        style: Object.assign(Object.assign({}, child.props.style), styles.grid),
      }),
    );
  }
  return _jsx('div', { style: styles.grid });
};
export default Checkboard;
