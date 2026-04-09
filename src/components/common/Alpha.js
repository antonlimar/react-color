import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useCallback, useEffect, useRef, useState } from 'react';
import reactCSS from 'reactcss';
import * as alpha from '../../helpers/alpha';
import Checkboard from './Checkboard';
export function Alpha(props) {
  const { a, direction, hsl, onChange, pointer, radius, renderers, rgb, shadow, style } = props;
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const handleChange = useCallback(
    (event) => {
      if (!containerRef.current) {
        return;
      }
      const change = alpha.calculateChange(event, hsl, direction, a, containerRef.current);
      if (change && typeof onChange === 'function') {
        onChange(change, event);
      }
    },
    [a, direction, hsl, onChange],
  );
  const handleMouseDown = (event) => {
    handleChange(event);
    setIsDragging(true);
  };
  useEffect(() => {
    if (!isDragging) {
      return;
    }
    const handleWindowMouseMove = (event) => {
      handleChange(event);
    };
    const handleWindowMouseUp = () => {
      setIsDragging(false);
    };
    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [handleChange, isDragging]);
  const styles = reactCSS(
    {
      default: {
        alpha: {
          absolute: '0px 0px 0px 0px',
          borderRadius: radius,
        },
        checkboard: {
          absolute: '0px 0px 0px 0px',
          overflow: 'hidden',
          borderRadius: radius,
        },
        gradient: {
          absolute: '0px 0px 0px 0px',
          background: `linear-gradient(to right, rgba(${rgb.r},${rgb.g},${rgb.b}, 0) 0%,
           rgba(${rgb.r},${rgb.g},${rgb.b}, 1) 100%)`,
          boxShadow: shadow,
          borderRadius: radius,
        },
        container: {
          position: 'relative',
          height: '100%',
          margin: '0 3px',
        },
        pointer: {
          position: 'absolute',
          left: `${rgb.a * 100}%`,
        },
        slider: {
          width: '4px',
          borderRadius: '1px',
          height: '8px',
          boxShadow: '0 0 2px rgba(0, 0, 0, .6)',
          background: '#fff',
          marginTop: '1px',
          transform: 'translateX(-2px)',
        },
      },
      vertical: {
        gradient: {
          background: `linear-gradient(to bottom, rgba(${rgb.r},${rgb.g},${rgb.b}, 0) 0%,
           rgba(${rgb.r},${rgb.g},${rgb.b}, 1) 100%)`,
        },
        pointer: {
          left: 0,
          top: `${rgb.a * 100}%`,
        },
      },
      overwrite: Object.assign({}, style),
    },
    {
      vertical: direction === 'vertical',
      overwrite: true,
    },
  );
  const Pointer = pointer;
  return _jsxs('div', {
    style: styles.alpha,
    children: [
      _jsx('div', { style: styles.checkboard, children: _jsx(Checkboard, { renderers: renderers }) }),
      _jsx('div', { style: styles.gradient }),
      _jsx('div', {
        style: styles.container,
        ref: containerRef,
        onMouseDown: handleMouseDown,
        onTouchMove: handleChange,
        onTouchStart: handleChange,
        children: _jsx('div', {
          style: styles.pointer,
          children: Pointer ? _jsx(Pointer, Object.assign({}, props)) : _jsx('div', { style: styles.slider }),
        }),
      }),
    ],
  });
}
export default Alpha;
