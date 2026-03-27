import { useCallback, useEffect, useRef, useState } from 'react';
import reactCSS from 'reactcss';
import throttle from 'lodash/throttle';
import * as saturation from '../../helpers/saturation';
import type { MouseEvent } from 'react';
import type { InternalColorChangeEvent, SaturationProps } from '../../types';

type ThrottledChange = {
  (
    fn: NonNullable<SaturationProps['onChange']>,
    data: ReturnType<typeof saturation.calculateChange>,
    event: InternalColorChangeEvent,
  ): void;
  cancel(): void;
};

const SATURATION_WHITE_GRADIENT = 'linear-gradient(to right, #fff, rgba(255,255,255,0))';
const SATURATION_BLACK_GRADIENT = 'linear-gradient(to top, #000, rgba(0,0,0,0))';

export const getSaturationRenderWindow = (container: HTMLDivElement | null): Window =>
  container?.ownerDocument?.defaultView ?? window;

export function Saturation(props: SaturationProps) {
  const { hsl, hsv, onChange, pointer, radius, shadow, style } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const throttledChangeRef = useRef<ThrottledChange>(
    throttle(
      (
        fn: NonNullable<SaturationProps['onChange']>,
        data: ReturnType<typeof saturation.calculateChange>,
        event: InternalColorChangeEvent,
      ) => {
        fn(data, event);
      },
      50,
    ),
  );
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = useCallback(
    (event: InternalColorChangeEvent) => {
      if (!containerRef.current || typeof onChange !== 'function') {
        return;
      }

      throttledChangeRef.current(onChange, saturation.calculateChange(event, hsl, containerRef.current), event);
    },
    [hsl, onChange],
  );

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    handleChange(event);
    setIsDragging(true);
  };

  useEffect(() => {
    const throttledChange = throttledChangeRef.current;

    return () => {
      throttledChange.cancel();
    };
  }, []);

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    const renderWindow = getSaturationRenderWindow(containerRef.current);
    const handleWindowMouseMove = (event: globalThis.MouseEvent) => {
      handleChange(event);
    };
    const handleWindowMouseUp = () => {
      setIsDragging(false);
    };

    renderWindow.addEventListener('mousemove', handleWindowMouseMove);
    renderWindow.addEventListener('mouseup', handleWindowMouseUp);

    return () => {
      renderWindow.removeEventListener('mousemove', handleWindowMouseMove);
      renderWindow.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [handleChange, isDragging]);

  const { color, white, black, pointer: pointerStyle, circle } = style || {};
  const styles = reactCSS(
    {
      default: {
        color: {
          absolute: '0px 0px 0px 0px',
          background: `hsl(${hsl.h},100%, 50%)`,
          borderRadius: radius,
        },
        white: {
          absolute: '0px 0px 0px 0px',
          borderRadius: radius,
          background: SATURATION_WHITE_GRADIENT,
        },
        black: {
          absolute: '0px 0px 0px 0px',
          boxShadow: shadow,
          borderRadius: radius,
          background: SATURATION_BLACK_GRADIENT,
        },
        pointer: {
          position: 'absolute',
          top: `${-(hsv.v * 100) + 100}%`,
          left: `${hsv.s * 100}%`,
          cursor: 'default',
        },
        circle: {
          width: '4px',
          height: '4px',
          boxShadow: `0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0,0,0,.3),
            0 0 1px 2px rgba(0,0,0,.4)`,
          borderRadius: '50%',
          cursor: 'hand',
          transform: 'translate(-2px, -2px)',
        },
      },
      custom: {
        color,
        white,
        black,
        pointer: pointerStyle,
        circle,
      },
    },
    { custom: !!style },
  );

  const Pointer = pointer;

  return (
    <div
      style={styles.color}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onTouchMove={handleChange}
      onTouchStart={handleChange}
    >
      <div style={styles.white} className="saturation-white">
        <div style={styles.black} className="saturation-black" />
        <div style={styles.pointer}>{Pointer ? <Pointer {...props} /> : <div style={styles.circle} />}</div>
      </div>
    </div>
  );
}

export default Saturation;
