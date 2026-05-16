import type { PointerEvent as ReactPointerEvent } from 'react';

const docsSearchScrollbarTrackInset = 8;
const docsSearchScrollbarMinThumbHeight = 44;

export function updateDocsSearchScrollbar(results: HTMLElement) {
  const shell = results.closest<HTMLElement>('.docs-search__results-shell');

  if (!shell) {
    return;
  }

  const scrollableDistance = results.scrollHeight - results.clientHeight;

  if (scrollableDistance <= 1) {
    shell.classList.remove('docs-search__results-shell--scrollable');
    return;
  }

  const trackHeight = Math.max(0, results.clientHeight - docsSearchScrollbarTrackInset * 2);
  const thumbHeight = Math.max(
    docsSearchScrollbarMinThumbHeight,
    (results.clientHeight / results.scrollHeight) * trackHeight,
  );
  const maxThumbOffset = Math.max(0, trackHeight - thumbHeight);
  const thumbOffset = (results.scrollTop / scrollableDistance) * maxThumbOffset;

  shell.classList.add('docs-search__results-shell--scrollable');
  shell.style.setProperty('--docs-search-scrollbar-thumb-height', `${thumbHeight}px`);
  shell.style.setProperty('--docs-search-scrollbar-thumb-offset', `${docsSearchScrollbarTrackInset + thumbOffset}px`);
}

export function syncDocsSearchScrollbars() {
  if (typeof document === 'undefined') {
    return;
  }

  document.querySelectorAll<HTMLElement>('.docs-search__results').forEach(updateDocsSearchScrollbar);
}

export function handleDocsSearchScrollbarDrag(event: ReactPointerEvent<HTMLElement>) {
  if (event.pointerType === 'mouse' && event.button !== 0) {
    return;
  }

  const scrollbar = event.currentTarget;
  const shell = scrollbar.closest<HTMLElement>('.docs-search__results-shell');
  const results = shell?.querySelector<HTMLElement>('.docs-search__results');

  if (!shell || !results) {
    return;
  }

  const scrollableDistance = results.scrollHeight - results.clientHeight;

  if (scrollableDistance <= 1) {
    return;
  }

  const trackHeight = Math.max(0, results.clientHeight - docsSearchScrollbarTrackInset * 2);
  const thumbHeight = Math.max(
    docsSearchScrollbarMinThumbHeight,
    (results.clientHeight / results.scrollHeight) * trackHeight,
  );
  const maxThumbOffset = Math.max(0, trackHeight - thumbHeight);

  if (maxThumbOffset <= 0) {
    return;
  }

  const scrollbarRect = scrollbar.getBoundingClientRect();
  const currentThumbOffset = (results.scrollTop / scrollableDistance) * maxThumbOffset;
  const pointerTarget = event.target as HTMLElement;
  const didGrabThumb = Boolean(pointerTarget.closest('.docs-search-scrollbar__thumb'));
  const grabOffset = didGrabThumb
    ? event.clientY - scrollbarRect.top - docsSearchScrollbarTrackInset - currentThumbOffset
    : thumbHeight / 2;

  const setResultsScrollFromPointer = (clientY: number) => {
    const nextThumbOffset = Math.min(
      maxThumbOffset,
      Math.max(0, clientY - scrollbarRect.top - docsSearchScrollbarTrackInset - grabOffset),
    );

    results.scrollTop = (nextThumbOffset / maxThumbOffset) * scrollableDistance;
    updateDocsSearchScrollbar(results);
  };

  const handlePointerMove = (pointerEvent: PointerEvent) => {
    pointerEvent.preventDefault();
    setResultsScrollFromPointer(pointerEvent.clientY);
  };

  const stopDragging = () => {
    shell.classList.remove('docs-search__results-shell--dragging');
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', stopDragging);
    window.removeEventListener('pointercancel', stopDragging);
    scrollbar.removeEventListener('lostpointercapture', stopDragging);
  };

  event.preventDefault();
  shell.classList.add('docs-search__results-shell--dragging');
  if (typeof scrollbar.setPointerCapture === 'function') {
    scrollbar.setPointerCapture(event.pointerId);
  }
  window.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('pointerup', stopDragging);
  window.addEventListener('pointercancel', stopDragging);
  scrollbar.addEventListener('lostpointercapture', stopDragging);

  if (!didGrabThumb) {
    setResultsScrollFromPointer(event.clientY);
  }
}
