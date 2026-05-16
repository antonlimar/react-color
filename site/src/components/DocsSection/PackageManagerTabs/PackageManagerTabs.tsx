import { packageManagers } from '../../../utils/docsSections';
import { siteBem } from '../../../utils/siteBem';
import type { PackageManager } from '../../../content';
import './PackageManagerTabs.scss';

interface PackageManagerTabsProps {
  packageManager: PackageManager;
  setPackageManager: (manager: PackageManager) => void;
}

export function PackageManagerTabs({ packageManager, setPackageManager }: PackageManagerTabsProps) {
  const b = siteBem('package-manager-tabs');

  return (
    <div className={b()} role="tablist" aria-label="Package manager">
      {packageManagers.map((manager) => (
        <button
          className={b('tab', { active: packageManager === manager })}
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
