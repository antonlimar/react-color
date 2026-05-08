import type { InternalColorChangeEvent } from '../types';
import type { MouseLikeEvent, PageCoordinates, TouchLikeEvent } from './types';

export const getPageCoordinates = (event: InternalColorChangeEvent): PageCoordinates => {
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
