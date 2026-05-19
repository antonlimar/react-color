import { throttle } from 'lodash-es';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, MouseEvent } from 'react';
import { calculateSaturationChange } from '@/helpers';
import type { InternalColorChangeEvent } from '@/types';
import { bem } from '../styleArchitecture';
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
const SATURATION_MIN = 0;
const SATURATION_MAX = 1;

const clampUnit = (value: number) => Math.min(SATURATION_MAX, Math.max(SATURATION_MIN, value));
const roundUnit = (value: number) => Math.round(value * 100) / 100;

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

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let nextSaturation = hsv.s;
    let nextValue = hsv.v;

    switch (event.key) {
      case 'ArrowLeft':
        nextSaturation = hsv.s - 0.01;
        break;
      case 'ArrowRight':
        nextSaturation = hsv.s + 0.01;
        break;
      case 'ArrowDown':
        nextValue = hsv.v - 0.01;
        break;
      case 'ArrowUp':
        nextValue = hsv.v + 0.01;
        break;
      case 'PageDown':
        nextValue = hsv.v - 0.1;
        break;
      case 'PageUp':
        nextValue = hsv.v + 0.1;
        break;
      default:
        return;
    }

    event.preventDefault();

    const s = roundUnit(clampUnit(nextSaturation));
    const v = roundUnit(clampUnit(nextValue));

    if ((s !== hsv.s || v !== hsv.v) && typeof onChange === 'function') {
      onChange(
        {
          h: hsv.h,
          s,
          v,
          a: hsv.a,
          source: 'hsv',
        },
        event as unknown as InternalColorChangeEvent,
      );
    }
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
      aria-label="Color saturation and brightness"
      className={b()}
      style={rootStyle}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      onTouchMove={handleChange}
      onTouchStart={handleChange}
      tabIndex={0}
    >
      <div className={b('white')} style={whiteStyle}>
        <div className={b('black')} style={blackStyle} />
        <div className={b('pointer')} style={controlPointerStyle}>
          {Pointer ? <Pointer {...props} /> : <div className={b('circle')} style={circleStyle} />}
        </div>
      </div>
    </div>
  );
}
