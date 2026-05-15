import type { PointerEvent as ReactPointerEvent } from 'react';
import { siteSections } from '../content';
import { createPropertyGroupAnchorId } from './docsSections';
import type { ContentSection, ContentSubsection, PropertyGroup } from '../content';

interface NavSubsection extends ContentSubsection {
  children: Array<{
    id: string;
    title: string;
  }>;
}

function createNavItems(section: ContentSection) {
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

function isSubsectionActive(subsection: NavSubsection, activeAnchorId: string) {
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

export function SectionNavigation({
  activeAnchorId,
  anchorPath = '',
  className = 'section-nav',
  onNavigate,
}: {
  activeAnchorId: string;
  anchorPath?: string;
  className?: string;
  onNavigate?: () => void;
}) {
  const navSections = siteSections.map(createNavItems);
  const isDrawerNavigation = className.split(' ').includes('section-nav--drawer');

  return (
    <div className={`section-nav-shell${isDrawerNavigation ? ' section-nav-shell--drawer' : ''}`}>
      <nav className={className} aria-label="Section navigation">
        <ul className="section-nav__list">
          {navSections.map((section) => {
            const isSectionActive =
              activeAnchorId === section.id ||
              section.subsections.some((subsection) => isSubsectionActive(subsection, activeAnchorId));

            return (
              <li className="section-nav__item" key={section.id}>
                <a
                  className={`section-nav__link${isSectionActive ? ' section-nav__link--active' : ''}`}
                  href={`${anchorPath}#${section.id}`}
                  data-anchor-id={section.id}
                  aria-current={activeAnchorId === section.id ? 'location' : undefined}
                  onClick={onNavigate}
                >
                  <span className="section-nav__index">
                    {String(siteSections.findIndex((entry) => entry.id === section.id) + 1).padStart(2, '0')}
                  </span>
                  <span>{section.title}</span>
                </a>

                {section.subsections.length > 0 ? (
                  <ul className="section-nav__sublist">
                    {section.subsections.map((subsection) => (
                      <li key={subsection.id}>
                        <a
                          className={`section-nav__sublink${
                            isSubsectionActive(subsection, activeAnchorId) ? ' section-nav__sublink--active' : ''
                          }`}
                          href={`${anchorPath}#${subsection.id}`}
                          data-anchor-id={subsection.id}
                          aria-current={activeAnchorId === subsection.id ? 'location' : undefined}
                          onClick={onNavigate}
                        >
                          {subsection.title}
                        </a>
                        {subsection.children.length > 0 ? (
                          <ul className="section-nav__childlist">
                            {subsection.children.map((child) => (
                              <li key={child.id}>
                                <a
                                  className={`section-nav__childlink${
                                    activeAnchorId === child.id || activeAnchorId.startsWith(`${child.id}-`)
                                      ? ' section-nav__childlink--active'
                                      : ''
                                  }`}
                                  href={`${anchorPath}#${child.id}`}
                                  data-anchor-id={child.id}
                                  aria-current={activeAnchorId === child.id ? 'location' : undefined}
                                  onClick={onNavigate}
                                >
                                  {child.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      </nav>
      <span className="section-nav-scrollbar" aria-hidden="true" onPointerDown={handleSectionNavigationScrollbarDrag}>
        <span className="section-nav-scrollbar__thumb" />
      </span>
    </div>
  );
}
