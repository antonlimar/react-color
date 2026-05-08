import { useCallback, useEffect, useRef, useState } from 'react';
import * as hue from '../../../helpers/hue';
import type { MouseEvent } from 'react';
import type { CSSProperties } from 'react';
import type { HueProps, InternalColorChangeEvent } from '../../../types';
import { getPickerClassName } from '../styleArchitecture';
import { getSlotStyleOverride } from '../styleOverrides';

const HUE_GRADIENT_HORIZONTAL =
  'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)';
const HUE_GRADIENT_VERTICAL =
  'linear-gradient(to top, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)';
const HUE_STYLE_SLOTS = ['hue', 'container', 'pointer', 'slider'] as const;

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

  const rootStyle: CSSProperties = {
    borderRadius: radius,
    boxShadow: shadow,
    ...getSlotStyleOverride(props.style, 'hue', HUE_STYLE_SLOTS, 'hue'),
  };
  const containerStyle: CSSProperties = {
    borderRadius: radius,
    background: direction === 'vertical' ? HUE_GRADIENT_VERTICAL : HUE_GRADIENT_HORIZONTAL,
    ...getSlotStyleOverride(props.style, 'container', HUE_STYLE_SLOTS, 'hue'),
  };
  const pointerStyle: CSSProperties = {
    left: direction === 'vertical' ? '0px' : `${(hsl.h * 100) / 360}%`,
    top: direction === 'vertical' ? `${-((hsl.h * 100) / 360) + 100}%` : undefined,
    ...getSlotStyleOverride(props.style, 'pointer', HUE_STYLE_SLOTS, 'hue'),
  };
  const sliderStyle: CSSProperties = {
    ...getSlotStyleOverride(props.style, 'slider', HUE_STYLE_SLOTS, 'hue'),
  };

  const Pointer = pointer;

  return (
    <div
      className={getPickerClassName({
        block: 'hueControl',
        modifiers: [direction === 'vertical' && 'vertical'],
      })}
      style={rootStyle}
    >
      <div
        className={getPickerClassName({
          block: 'hueControl',
          slot: 'container',
          className: `hue-${direction}`,
        })}
        style={containerStyle}
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchMove={handleChange}
        onTouchStart={handleChange}
      >
        <div className={getPickerClassName({ block: 'hueControl', slot: 'pointer' })} style={pointerStyle}>
          {Pointer ? (
            <Pointer {...props} />
          ) : (
            <div className={getPickerClassName({ block: 'hueControl', slot: 'slider' })} style={sliderStyle} />
          )}
        </div>
      </div>
    </div>
  );
}
