import type { RefObject } from 'react';
import { siteBem } from '../../utils/siteBem';
import { SectionNavigation } from '../SectionNavigation';
import './MobileSectionDrawer.scss';

interface MobileSectionDrawerProps {
  activeAnchorId: string;
  anchorNavigationPath: string;
  drawerPanelRef: RefObject<HTMLDivElement | null>;
  drawerToggleRef: RefObject<HTMLButtonElement | null>;
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

export function MobileSectionDrawer({
  activeAnchorId,
  anchorNavigationPath,
  drawerPanelRef,
  drawerToggleRef,
  isOpen,
  onClose,
  onToggle,
}: MobileSectionDrawerProps) {
  const b = siteBem('sections-shell');

  return (
    <>
      <div className={b('toolbar')}>
        <button
          className={b('drawer-toggle')}
          ref={drawerToggleRef}
          type="button"
          aria-label="Browse sections"
          aria-expanded={isOpen}
          aria-controls="mobile-section-nav"
          onClick={onToggle}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>
      <div className={b('drawer', { open: isOpen })} hidden={!isOpen} aria-hidden={!isOpen}>
        <button
          className={b('drawer-backdrop')}
          type="button"
          aria-label="Close section navigation"
          onClick={onClose}
        />
        <div
          className={b('drawer-panel')}
          id="mobile-section-nav"
          ref={drawerPanelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-section-nav-title"
          tabIndex={-1}
        >
          <div className={b('drawer-head')}>
            <strong id="mobile-section-nav-title">Sections</strong>
            <button className={b('drawer-close')} type="button" aria-label="Close section navigation" onClick={onClose}>
              Close
            </button>
          </div>
          <SectionNavigation
            activeAnchorId={activeAnchorId}
            anchorPath={anchorNavigationPath}
            isDrawer
            onNavigate={onClose}
          />
        </div>
      </div>
    </>
  );
}
