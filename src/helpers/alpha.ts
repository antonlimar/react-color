import type { AlphaChange, HSLAColor, InternalColorChangeEvent } from '../types';
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
  hsl: HSLAColor,
  direction: SliderDirection = 'horizontal',
  initialA: number | undefined,
  container: SliderChangeContainer,
): AlphaChange | null => {
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  const { pageX, pageY } = getPageCoordinates(event);
  const left = pageX - (container.getBoundingClientRect().left + window.pageXOffset);
  const top = pageY - (container.getBoundingClientRect().top + window.pageYOffset);

  if (direction === 'vertical') {
    let a;

    if (top < 0) {
      a = 0;
    } else if (top > containerHeight) {
      a = 1;
    } else {
      a = Math.round((top * 100) / containerHeight) / 100;
    }

    if (hsl.a !== a) {
      return {
        h: hsl.h,
        s: hsl.s,
        l: hsl.l,
        a,
        source: 'rgb',
      };
    }
  } else {
    let a;

    if (left < 0) {
      a = 0;
    } else if (left > containerWidth) {
      a = 1;
    } else {
      a = Math.round((left * 100) / containerWidth) / 100;
    }

    if (initialA !== a) {
      return {
        h: hsl.h,
        s: hsl.s,
        l: hsl.l,
        a,
        source: 'rgb',
      };
    }
  }

  return null;
};
