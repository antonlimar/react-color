import type { PointerEvent as ReactPointerEvent } from 'react';
import { createPropertyGroupAnchorId } from '../../utils/docsSections';
import type { ContentSection, ContentSubsection, PropertyGroup } from '../../content';

export interface NavSubsection extends ContentSubsection {
  children: Array<{
    id: string;
    title: string;
  }>;
}

export function createNavItems(section: ContentSection) {
  return {
    id: section.id,
    title: section.title,
    subsections:
      section.subsections?.map((subsection): NavSubsection => {
        const children =
          subsection.id === 'picker-specific-props'
            ? (subsection.propertyGroups ?? []).map((group: PropertyGroup) => ({
                id: createPropertyGroupAnchorId(subsection, group),
                title: group.title,
              }))
            : [];

        return {
          ...subsection,
          children,
        };
      }) ?? [],
  };
}

export function isSubsectionActive(subsection: NavSubsection, activeAnchorId: string) {
  return (
    subsection.id === activeAnchorId ||
    subsection.children.some((child) => child.id === activeAnchorId || activeAnchorId.startsWith(`${child.id}-`))
  );
}

const sectionNavigationScrollbarTrackInset = 16;
const sectionNavigationScrollbarMinThumbHeight = 44;

export function updateSectionNavigationScrollbar(navigation: HTMLElement) {
  const shell = navigation.closest<HTMLElement>('.section-nav-shell');

  if (!shell) {
    return;
  }

  const scrollableDistance = navigation.scrollHeight - navigation.clientHeight;

  if (scrollableDistance <= 1) {
    shell.classList.remove('section-nav-shell--scrollable');
    return;
  }

  const trackHeight = Math.max(0, navigation.clientHeight - sectionNavigationScrollbarTrackInset * 2);
  const thumbHeight = Math.max(
    sectionNavigationScrollbarMinThumbHeight,
    (navigation.clientHeight / navigation.scrollHeight) * trackHeight,
  );
  const maxThumbOffset = Math.max(0, trackHeight - thumbHeight);
  const thumbOffset = (navigation.scrollTop / scrollableDistance) * maxThumbOffset;

  shell.classList.add('section-nav-shell--scrollable');
  shell.style.setProperty('--section-nav-scrollbar-thumb-height', `${thumbHeight}px`);
  shell.style.setProperty(
    '--section-nav-scrollbar-thumb-offset',
    `${sectionNavigationScrollbarTrackInset + thumbOffset}px`,
  );
}

export function syncSectionNavigationScrollbars() {
  if (typeof document === 'undefined') {
    return;
  }

  document.querySelectorAll<HTMLElement>('.section-nav').forEach(updateSectionNavigationScrollbar);
}

export function handleSectionNavigationScrollbarDrag(event: ReactPointerEvent<HTMLElement>) {
  if (event.pointerType === 'mouse' && event.button !== 0) {
    return;
  }

  const scrollbar = event.currentTarget;
  const shell = scrollbar.closest<HTMLElement>('.section-nav-shell');
  const navigation = shell?.querySelector<HTMLElement>('.section-nav');

  if (!shell || !navigation) {
    return;
  }

  const scrollableDistance = navigation.scrollHeight - navigation.clientHeight;

  if (scrollableDistance <= 1) {
    return;
  }

  const trackHeight = Math.max(0, navigation.clientHeight - sectionNavigationScrollbarTrackInset * 2);
  const thumbHeight = Math.max(
    sectionNavigationScrollbarMinThumbHeight,
    (navigation.clientHeight / navigation.scrollHeight) * trackHeight,
  );
  const maxThumbOffset = Math.max(0, trackHeight - thumbHeight);

  if (maxThumbOffset <= 0) {
    return;
  }

  const scrollbarRect = scrollbar.getBoundingClientRect();
  const currentThumbOffset = (navigation.scrollTop / scrollableDistance) * maxThumbOffset;
  const pointerTarget = event.target as HTMLElement;
  const didGrabThumb = Boolean(pointerTarget.closest('.section-nav-scrollbar__thumb'));
  const grabOffset = didGrabThumb
    ? event.clientY - scrollbarRect.top - sectionNavigationScrollbarTrackInset - currentThumbOffset
    : thumbHeight / 2;

  const setNavigationScrollFromPointer = (clientY: number) => {
    const nextThumbOffset = Math.min(
      maxThumbOffset,
      Math.max(0, clientY - scrollbarRect.top - sectionNavigationScrollbarTrackInset - grabOffset),
    );

    navigation.scrollTop = (nextThumbOffset / maxThumbOffset) * scrollableDistance;
    updateSectionNavigationScrollbar(navigation);
  };

  const handlePointerMove = (pointerEvent: PointerEvent) => {
    pointerEvent.preventDefault();
    setNavigationScrollFromPointer(pointerEvent.clientY);
  };

  const stopDragging = () => {
    shell.classList.remove('section-nav-shell--dragging');
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', stopDragging);
    window.removeEventListener('pointercancel', stopDragging);
    scrollbar.removeEventListener('lostpointercapture', stopDragging);
  };

  event.preventDefault();
  shell.classList.add('section-nav-shell--dragging');
  if (typeof scrollbar.setPointerCapture === 'function') {
    scrollbar.setPointerCapture(event.pointerId);
  }
  window.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('pointerup', stopDragging);
  window.addEventListener('pointercancel', stopDragging);
  scrollbar.addEventListener('lostpointercapture', stopDragging);

  if (!didGrabThumb) {
    setNavigationScrollFromPointer(event.clientY);
  }
}

export function syncDesktopAnchorNavigationScroll(activeAnchorId: string) {
  if (typeof document === 'undefined') {
    return;
  }

  const navigation = document.querySelector<HTMLElement>('.sections-layout__sidebar .section-nav');

  if (!navigation) {
    return;
  }

  const links = Array.from(navigation.querySelectorAll<HTMLElement>('a[data-anchor-id]'));
  let activeLink = links.find((link) => link.dataset.anchorId === activeAnchorId);

  if (!activeLink) {
    for (let index = links.length - 1; index >= 0; index -= 1) {
      const link = links[index];
      const anchorId = link.dataset.anchorId;

      if (anchorId && activeAnchorId.startsWith(`${anchorId}-`)) {
        activeLink = link;
        break;
      }
    }
  }

  if (!activeLink) {
    return;
  }

  const navigationRect = navigation.getBoundingClientRect();
  const activeLinkRect = activeLink.getBoundingClientRect();
  const nextScrollTop =
    navigation.scrollTop +
    activeLinkRect.top -
    navigationRect.top -
    (navigation.clientHeight - activeLink.clientHeight) / 2;

  const clampedScrollTop = Math.max(0, nextScrollTop);
  const scrollTo = navigation.scrollTo;

  if (typeof scrollTo === 'function') {
    navigation.scrollTo({ top: clampedScrollTop, behavior: 'smooth' });
    return;
  }

  navigation.scrollTop = clampedScrollTop;
}
