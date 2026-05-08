import type { HSLAColor, HueChange, InternalColorChangeEvent } from '../types';
import type { MouseLikeEvent, PageCoordinates, SliderChangeContainer, SliderDirection, TouchLikeEvent } from './types';

const getPageCoordinates = (event: InternalColorChangeEvent): PageCoordinates => {
  const mouseEvent = event as MouseLikeEvent;

  if (typeof mouseEvent.pageX === 'number' && typeof mouseEvent.pageY === 'number') {
    return { pageX: mouseEvent.pageX, pageY: mouseEvent.pageY };
  }

  const touchEvent = event as unknown as TouchLikeEvent;

  return {
    pageX: touchEvent.touches[0].pageX,
    pageY: touchEvent.touches[0].pageY,
  };
};

export const calculateChange = (
  event: InternalColorChangeEvent,
  direction: SliderDirection = 'horizontal',
  hsl: HSLAColor,
  container: SliderChangeContainer,
): HueChange | null => {
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  const { pageX, pageY } = getPageCoordinates(event);
  const left = pageX - (container.getBoundingClientRect().left + window.pageXOffset);
  const top = pageY - (container.getBoundingClientRect().top + window.pageYOffset);

  if (direction === 'vertical') {
    let h;

    if (top < 0) {
      h = 359;
    } else if (top > containerHeight) {
      h = 0;
    } else {
      const percent = -((top * 100) / containerHeight) + 100;
      h = (360 * percent) / 100;
    }

    if (hsl.h !== h) {
      return {
        h,
        s: hsl.s,
        l: hsl.l,
        a: hsl.a,
        source: 'hsl',
      };
    }
  } else {
    let h;

    if (left < 0) {
      h = 0;
    } else if (left > containerWidth) {
      h = 359;
    } else {
      const percent = (left * 100) / containerWidth;
      h = (360 * percent) / 100;
    }

    if (hsl.h !== h) {
      return {
        h,
        s: hsl.s,
        l: hsl.l,
        a: hsl.a,
        source: 'hsl',
      };
    }
  }

  return null;
};
