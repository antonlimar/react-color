import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import reactCSS from 'reactcss';
import { handleFocus } from '../../helpers/interaction';
import Checkboard from './Checkboard';
const ENTER = 13;
export const Swatch = ({
  color,
  style,
  onClick = () => {},
  onHover,
  title = color,
  children,
  focus,
  focusStyle = {},
}) => {
  const transparent = color === 'transparent';
  const styles = reactCSS({
    default: {
      swatch: Object.assign(
        Object.assign(
          {
            background: color,
            height: '100%',
            width: '100%',
            cursor: 'pointer',
            position: 'relative',
            outline: 'none',
          },
          style,
        ),
        focus ? focusStyle : {},
      ),
    },
  });
  const swatchStyle = styles.swatch || {};
  const handleClick = (event) => onClick(color, event);
  const handleKeyDown = (event) => event.keyCode === ENTER && onClick(color, event);
  const handleHover = (event) => (onHover === null || onHover === void 0 ? void 0 : onHover(color, event));
  const optionalEvents = onHover ? { onMouseOver: handleHover } : {};
  return _jsxs(
    'div',
    Object.assign(
      { style: swatchStyle, onClick: handleClick, title: title, tabIndex: 0, onKeyDown: handleKeyDown },
      optionalEvents,
      {
        children: [
          children,
          transparent &&
            _jsx(Checkboard, { borderRadius: swatchStyle.borderRadius, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)' }),
        ],
      },
    ),
  );
};
export default handleFocus(Swatch);
