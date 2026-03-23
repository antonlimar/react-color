import type { AlphaChange, HSLAColor, InternalColorChangeEvent } from '../types';

type Direction = 'horizontal' | 'vertical';

interface ContainerBounds {
  left: number;
  top: number;
}

interface ChangeContainer {
  clientWidth: number;
  clientHeight: number;
  getBoundingClientRect(): ContainerBounds;
}

interface TouchLike {
  pageX: number;
  pageY: number;
}

interface MouseLikeEvent {
  pageX: number;
  pageY: number;
}

interface TouchListLike {
  0: TouchLike;
  length: number;
}

interface TouchLikeEvent {
  touches: TouchListLike;
}

const getPageCoordinates = (event: InternalColorChangeEvent): TouchLike => {
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
  direction: Direction = 'horizontal',
  initialA: number | undefined,
  container: ChangeContainer,
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
