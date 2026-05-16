import type { RefObject } from 'react';
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
  return (
    <>
      <div className="sections-shell__toolbar">
        <button
          className="sections-shell__drawer-toggle"
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
      <div
        className={`sections-shell__drawer${isOpen ? ' sections-shell__drawer--open' : ''}`}
        hidden={!isOpen}
        aria-hidden={!isOpen}
      >
        <button
          className="sections-shell__drawer-backdrop"
          type="button"
          aria-label="Close section navigation"
          onClick={onClose}
        />
        <div
          className="sections-shell__drawer-panel"
          id="mobile-section-nav"
          ref={drawerPanelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-section-nav-title"
          tabIndex={-1}
        >
          <div className="sections-shell__drawer-head">
            <strong id="mobile-section-nav-title">Sections</strong>
            <button
              className="sections-shell__drawer-close"
              type="button"
              aria-label="Close section navigation"
              onClick={onClose}
            >
              Close
            </button>
          </div>
          <SectionNavigation
            activeAnchorId={activeAnchorId}
            anchorPath={anchorNavigationPath}
            className="section-nav section-nav--drawer"
            onNavigate={onClose}
          />
        </div>
      </div>
    </>
  );
}
