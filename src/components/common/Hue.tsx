import { useCallback, useEffect, useRef, useState } from 'react';
import reactCSS from 'reactcss';
import * as hue from '../../helpers/hue';
import type { MouseEvent } from 'react';
import type { HueProps, InternalColorChangeEvent } from '../../types';

const HUE_GRADIENT_HORIZONTAL =
  'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)';
const HUE_GRADIENT_VERTICAL =
  'linear-gradient(to top, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)';

export function Hue(props: HueProps) {
  const { direction = 'horizontal', hsl, onChange, pointer, radius, shadow } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = useCallback(
    (event: InternalColorChangeEvent) => {
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

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    handleChange(event);
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    const handleWindowMouseMove = (event: globalThis.MouseEvent) => {
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

  return (
    <div style={styles.hue}>
      <div
        className={`hue-${direction}`}
        style={styles.container}
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchMove={handleChange}
        onTouchStart={handleChange}
      >
        <div style={styles.pointer}>{Pointer ? <Pointer {...props} /> : <div style={styles.slider} />}</div>
      </div>
    </div>
  );
}

export default Hue;
