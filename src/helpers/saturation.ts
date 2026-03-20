import type { HSLAColor, InternalColorChangeEvent, SaturationChange } from '../types'

interface ContainerRect {
  width: number
  height: number
  left: number
  top: number
}

interface ChangeContainer {
  getBoundingClientRect(): ContainerRect
}

interface TouchLike {
  pageX: number
  pageY: number
}

interface MouseLikeEvent {
  pageX: number
  pageY: number
}

interface TouchListLike {
  0: TouchLike
  length: number
}

interface TouchLikeEvent {
  touches: TouchListLike
}

const getPageCoordinates = (event: InternalColorChangeEvent): TouchLike => {
  const mouseEvent = event as MouseLikeEvent

  if (typeof mouseEvent.pageX === 'number' && typeof mouseEvent.pageY === 'number') {
    return { pageX: mouseEvent.pageX, pageY: mouseEvent.pageY }
  }

  const touchEvent = event as unknown as TouchLikeEvent

  return {
    pageX: touchEvent.touches[0].pageX,
    pageY: touchEvent.touches[0].pageY,
  }
}

export const calculateChange = (
  event: InternalColorChangeEvent,
  hsl: HSLAColor,
  container: ChangeContainer,
): SaturationChange => {
  const { width: containerWidth, height: containerHeight, left: containerLeft, top: containerTop } =
    container.getBoundingClientRect()
  const { pageX, pageY } = getPageCoordinates(event)
  let left = pageX - (containerLeft + window.pageXOffset)
  let top = pageY - (containerTop + window.pageYOffset)

  if (left < 0) {
    left = 0
  } else if (left > containerWidth) {
    left = containerWidth
  }

  if (top < 0) {
    top = 0
  } else if (top > containerHeight) {
    top = containerHeight
  }

  const saturation = left / containerWidth
  const bright = 1 - (top / containerHeight)

  return {
    h: hsl.h,
    s: saturation,
    v: bright,
    a: hsl.a,
    source: 'hsv',
  }
}
