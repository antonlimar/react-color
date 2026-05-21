import { siteSections } from '../../content';
import { siteBem } from '../../utils';
import { createNavItems, handleSectionNavigationScrollbarDrag, isSubsectionActive } from './utils';
import './SectionNavigation.scss';

interface SectionNavigationProps {
  activeAnchorId: string;
  anchorPath?: string;
  isDrawer?: boolean;
  onNavigate?: () => void;
}

export function SectionNavigation({
  activeAnchorId,
  anchorPath = '',
  isDrawer = false,
  onNavigate,
}: SectionNavigationProps) {
  const navSections = siteSections.map(createNavItems);
  const b = siteBem('section-nav');
  const shell = siteBem('section-nav-shell');
  const scrollbar = siteBem('section-nav-scrollbar');

  return (
    <div className={shell({ drawer: isDrawer })}>
      <nav className={b({ drawer: isDrawer })} aria-label="Section navigation">
        <ul className={b('list')}>
          {navSections.map((section) => {
            const isSectionActive =
              activeAnchorId === section.id ||
              section.subsections.some((subsection) => isSubsectionActive(subsection, activeAnchorId));

            return (
              <li className={b('item')} key={section.id}>
                <a
                  className={b('link', { active: isSectionActive })}
                  href={`${anchorPath}#${section.id}`}
                  data-anchor-id={section.id}
                  aria-current={activeAnchorId === section.id ? 'location' : undefined}
                  onClick={onNavigate}
                >
                  <span className={b('index')}>
                    {String(siteSections.findIndex((entry) => entry.id === section.id) + 1).padStart(2, '0')}
                  </span>
                  <span>{section.title}</span>
                </a>

                {section.subsections.length > 0 ? (
                  <ul className={b('sublist')}>
                    {section.subsections.map((subsection) => (
                      <li key={subsection.id}>
                        <a
                          className={b('sublink', { active: isSubsectionActive(subsection, activeAnchorId) })}
                          href={`${anchorPath}#${subsection.id}`}
                          data-anchor-id={subsection.id}
                          aria-current={activeAnchorId === subsection.id ? 'location' : undefined}
                          onClick={onNavigate}
                        >
                          {subsection.title}
                        </a>
                        {subsection.children.length > 0 ? (
                          <ul className={b('childlist')}>
                            {subsection.children.map((child) => (
                              <li key={child.id}>
                                <a
                                  className={b('childlink', {
                                    active: activeAnchorId === child.id || activeAnchorId.startsWith(`${child.id}-`),
                                  })}
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
      <span className={scrollbar()} aria-hidden="true" onPointerDown={handleSectionNavigationScrollbarDrag}>
        <span className={scrollbar('thumb')} />
      </span>
    </div>
  );
}
