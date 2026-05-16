import { siteSections } from '../../content';
import { createNavItems, handleSectionNavigationScrollbarDrag, isSubsectionActive } from './utils';
import './SectionNavigation.scss';

interface SectionNavigationProps {
  activeAnchorId: string;
  anchorPath?: string;
  className?: string;
  onNavigate?: () => void;
}

export function SectionNavigation({
  activeAnchorId,
  anchorPath = '',
  className = 'section-nav',
  onNavigate,
}: SectionNavigationProps) {
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
