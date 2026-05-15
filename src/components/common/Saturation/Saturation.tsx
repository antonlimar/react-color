import { throttle } from 'lodash-es';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent } from 'react';
import { bem } from '@/components/common';
import { calculateSaturationChange } from '@/helpers';
import type { InternalColorChangeEvent } from '@/types';
import type { SaturationProps } from './types';
import './Saturation.scss';

type SaturationChangeHandler = NonNullable<SaturationProps['onChange']>;
type SaturationChangeData = ReturnType<typeof calculateSaturationChange>;
type ThrottledChange = {
  (fn: SaturationChangeHandler, data: SaturationChangeData, event: InternalColorChangeEvent): void;
  cancel(): void;
};

const b = bem('saturation');

const SATURATION_WHITE_GRADIENT = 'linear-gradient(to right, #fff, rgba(255,255,255,0))';
const SATURATION_BLACK_GRADIENT = 'linear-gradient(to top, #000, rgba(0,0,0,0))';

export const getSaturationRenderWindow = (container: HTMLDivElement | null): Window =>
  container?.ownerDocument?.defaultView ?? window;

export function Saturation(props: SaturationProps) {
  const { hsl, hsv, onChange, pointer, radius, shadow, style } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const throttledChangeRef = useRef<ThrottledChange>(
    throttle((fn: unknown, data: unknown, event: unknown) => {
      (fn as SaturationChangeHandler)(data as SaturationChangeData, event as InternalColorChangeEvent);
    }, 50) as ThrottledChange,
  );
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = useCallback(
    (event: InternalColorChangeEvent) => {
      if (!containerRef.current || typeof onChange !== 'function') {
        return;
      }

      throttledChangeRef.current(onChange, calculateSaturationChange(event, hsl, containerRef.current), event);
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
  const rootStyle: CSSProperties = {
    background: `hsl(${hsl.h},100%, 50%)`,
    borderRadius: radius,
    ...color,
  };
  const whiteStyle: CSSProperties = {
    borderRadius: radius,
    background: SATURATION_WHITE_GRADIENT,
    ...white,
  };
  const blackStyle: CSSProperties = {
    boxShadow: shadow,
    borderRadius: radius,
    background: SATURATION_BLACK_GRADIENT,
    ...black,
  };
  const controlPointerStyle: CSSProperties = {
    top: `${-(hsv.v * 100) + 100}%`,
    left: `${hsv.s * 100}%`,
    ...pointerStyle,
  };
  const circleStyle: CSSProperties = {
    ...circle,
  };

  const Pointer = pointer;

  return (
    <div
      className={b().toString()}
      style={rootStyle}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onTouchMove={handleChange}
      onTouchStart={handleChange}
    >
      <div className={b('white').toString()} style={whiteStyle}>
        <div className={b('black').toString()} style={blackStyle} />
        <div className={b('pointer').toString()} style={controlPointerStyle}>
          {Pointer ? <Pointer {...props} /> : <div className={b('circle').toString()} style={circleStyle} />}
        </div>
      </div>
    </div>
  );
}
