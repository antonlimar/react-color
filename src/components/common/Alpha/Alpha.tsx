import { useCallback, useEffect, useRef, useState } from 'react';
import { calculateChange as calculateAlphaChange } from '@/helpers/alpha';
import type { MouseEvent } from 'react';
import type { CSSProperties } from 'react';
import type { AlphaProps, InternalColorChangeEvent } from '@/types';
import { Checkboard } from '@/components/common/Checkboard';
import { getPickerClassName } from '@/components/common/styleArchitecture';
import { getSlotStyleOverride } from '@/components/common/styleOverrides';

const ALPHA_STYLE_SLOTS = ['alpha', 'checkboard', 'gradient', 'container', 'pointer', 'slider'] as const;

export function Alpha(props: AlphaProps) {
  const { a, direction, hsl, onChange, pointer, radius, renderers, rgb, shadow, style } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = useCallback(
    (event: InternalColorChangeEvent) => {
      if (!containerRef.current) {
        return;
      }

      const change = calculateAlphaChange(event, hsl, direction, a, containerRef.current);

      if (change && typeof onChange === 'function') {
        onChange(change, event);
      }
    },
    [a, direction, hsl, onChange],
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

  const rootStyle: CSSProperties = {
    borderRadius: radius,
    ...getSlotStyleOverride(style, 'alpha', ALPHA_STYLE_SLOTS, 'alpha'),
  };
  const checkboardStyle: CSSProperties = {
    borderRadius: radius,
    ...getSlotStyleOverride(style, 'checkboard', ALPHA_STYLE_SLOTS, 'alpha'),
  };
  const gradientStyle: CSSProperties = {
    background:
      direction === 'vertical'
        ? `linear-gradient(to bottom, rgba(${rgb.r},${rgb.g},${rgb.b}, 0) 0%,
           rgba(${rgb.r},${rgb.g},${rgb.b}, 1) 100%)`
        : `linear-gradient(to right, rgba(${rgb.r},${rgb.g},${rgb.b}, 0) 0%,
           rgba(${rgb.r},${rgb.g},${rgb.b}, 1) 100%)`,
    boxShadow: shadow,
    borderRadius: radius,
    ...getSlotStyleOverride(style, 'gradient', ALPHA_STYLE_SLOTS, 'alpha'),
  };
  const containerStyle: CSSProperties = {
    ...getSlotStyleOverride(style, 'container', ALPHA_STYLE_SLOTS, 'alpha'),
  };
  const pointerStyle: CSSProperties = {
    left: direction === 'vertical' ? 0 : `${rgb.a * 100}%`,
    top: direction === 'vertical' ? `${rgb.a * 100}%` : undefined,
    ...getSlotStyleOverride(style, 'pointer', ALPHA_STYLE_SLOTS, 'alpha'),
  };
  const sliderStyle: CSSProperties = {
    ...getSlotStyleOverride(style, 'slider', ALPHA_STYLE_SLOTS, 'alpha'),
  };

  const Pointer = pointer;

  return (
    <div
      className={getPickerClassName({
        block: 'alphaControl',
        modifiers: [direction === 'vertical' && 'vertical'],
      })}
      style={rootStyle}
    >
      <div className={getPickerClassName({ block: 'alphaControl', slot: 'checkboard' })} style={checkboardStyle}>
        <Checkboard renderers={renderers} />
      </div>
      <div className={getPickerClassName({ block: 'alphaControl', slot: 'gradient' })} style={gradientStyle} />
      <div
        className={getPickerClassName({ block: 'alphaControl', slot: 'container' })}
        style={containerStyle}
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchMove={handleChange}
        onTouchStart={handleChange}
      >
        <div className={getPickerClassName({ block: 'alphaControl', slot: 'pointer' })} style={pointerStyle}>
          {Pointer ? (
            <Pointer {...props} />
          ) : (
            <div className={getPickerClassName({ block: 'alphaControl', slot: 'slider' })} style={sliderStyle} />
          )}
        </div>
      </div>
    </div>
  );
}
