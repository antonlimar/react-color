import { packageManagers } from '../../../utils/docsSections';
import type { PackageManager } from '../../../content';
import './PackageManagerTabs.scss';

interface PackageManagerTabsProps {
  packageManager: PackageManager;
  setPackageManager: (manager: PackageManager) => void;
}

export function PackageManagerTabs({ packageManager, setPackageManager }: PackageManagerTabsProps) {
  return (
    <div className="package-manager-tabs" role="tablist" aria-label="Package manager">
      {packageManagers.map((manager) => (
        <button
          className={`package-manager-tabs__tab${packageManager === manager ? ' package-manager-tabs__tab--active' : ''}`}
          key={manager}
          type="button"
          role="tab"
          aria-selected={packageManager === manager}
          onClick={() => setPackageManager(manager)}
        >
          {manager}
        </button>
      ))}
    </div>
  );
}
