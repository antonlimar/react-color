import type { MouseLikeEvent, PageCoordinates, TouchLikeEvent } from './types';
import type { InternalColorChangeEvent } from '@/types';

export const getPageCoordinates = (event: InternalColorChangeEvent): PageCoordinates => {
  const mouseEvent = event as MouseLikeEvent;

  if (typeof mouseEvent.pageX === 'number' && typeof mouseEvent.pageY === 'number') {
    return { pageX: mouseEvent.pageX, pageY: mouseEvent.pageY };
  }

  const touchEvent = event as unknown as TouchLikeEvent;
  const { pageX, pageY } = touchEvent.touches[0];

  return { pageX, pageY };
};
