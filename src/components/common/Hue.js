import { jsx as _jsx } from 'react/jsx-runtime';
import { useCallback, useEffect, useRef, useState } from 'react';
import reactCSS from 'reactcss';
import * as hue from '../../helpers/hue';
const HUE_GRADIENT_HORIZONTAL =
  'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)';
const HUE_GRADIENT_VERTICAL =
  'linear-gradient(to top, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)';
export function Hue(props) {
  const { direction = 'horizontal', hsl, onChange, pointer, radius, shadow } = props;
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const handleChange = useCallback(
    (event) => {
      if (!containerRef.current) {
        return;
      }
      const change = hue.calculateChange(event, direction, hsl, containerRef.current);
      if (change && typeof onChange === 'function') {
        onChange(change, event);
      }
    },
    [direction, hsl, onChange],
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
        hue: {
          absolute: '0px 0px 0px 0px',
          borderRadius: radius,
          boxShadow: shadow,
        },
        container: {
          padding: '0 2px',
          position: 'relative',
          height: '100%',
          borderRadius: radius,
          background: HUE_GRADIENT_HORIZONTAL,
        },
        pointer: {
          position: 'absolute',
          left: `${(hsl.h * 100) / 360}%`,
        },
        slider: {
          marginTop: '1px',
          width: '4px',
          borderRadius: '1px',
          height: '8px',
          boxShadow: '0 0 2px rgba(0, 0, 0, .6)',
          background: '#fff',
          transform: 'translateX(-2px)',
        },
      },
      vertical: {
        container: {
          background: HUE_GRADIENT_VERTICAL,
        },
        pointer: {
          left: '0px',
          top: `${-((hsl.h * 100) / 360) + 100}%`,
        },
      },
    },
    { vertical: direction === 'vertical' },
  );
  const Pointer = pointer;
  return _jsx('div', {
    style: styles.hue,
    children: _jsx('div', {
      className: `hue-${direction}`,
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
  });
}
export default Hue;
