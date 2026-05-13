import type { HSLAColor, InternalColorChangeEvent } from '@/types';
import type { SaturationChange } from '@/components/common/Saturation/types';
import { getPageCoordinates } from './coordinates';
import type { SaturationChangeContainer } from './types';

export const calculateChange = (
  event: InternalColorChangeEvent,
  hsl: HSLAColor,
  container: SaturationChangeContainer,
): SaturationChange => {
  const {
    width: containerWidth,
    height: containerHeight,
    left: containerLeft,
    top: containerTop,
  } = container.getBoundingClientRect();
  const { pageX, pageY } = getPageCoordinates(event);
  let left = pageX - (containerLeft + window.pageXOffset);
  let top = pageY - (containerTop + window.pageYOffset);

  if (left < 0) {
    left = 0;
  } else if (left > containerWidth) {
    left = containerWidth;
  }

  if (top < 0) {
    top = 0;
  } else if (top > containerHeight) {
    top = containerHeight;
  }

  const saturation = left / containerWidth;
  const bright = 1 - top / containerHeight;

  return {
    h: hsl.h,
    s: saturation,
    v: bright,
    a: hsl.a,
    source: 'hsv',
  };
};
