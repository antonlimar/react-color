import type { CodeBlock, PackageManager, SectionBlock } from '../../../content';
import { siteBem } from '../../../utils/siteBem';
import { CodeFigure } from '../../CodeFigure';
import { InlineContent } from '../../InlineContent';
import { PackageManagerTabs } from '../PackageManagerTabs';
import './SectionBlockView.scss';

interface SectionBlockViewProps {
  block: SectionBlock;
  packageManager: PackageManager;
  setPackageManager: (manager: PackageManager) => void;
}

export function SectionBlockView({ block, packageManager, setPackageManager }: SectionBlockViewProps) {
  const text = siteBem('content-text');
  const list = siteBem('content-list');

  if (block.type === 'text') {
    return (
      <p className={text()}>
        <InlineContent text={block.text} />
      </p>
    );
  }

  if (block.type === 'bullets') {
    return (
      <ul className={list()}>
        {block.items.map((item) => (
          <li key={item}>
            <InlineContent text={item} />
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === 'package-manager') {
    const command = block.commands[packageManager];

    return (
      <CodeFigure
        code={command}
        language="bash"
        label={block.label}
        packageManagerControls={
          <PackageManagerTabs packageManager={packageManager} setPackageManager={setPackageManager} />
        }
      />
    );
  }

  const codeBlock = block as CodeBlock;

  return (
    <CodeFigure
      code={codeBlock.code}
      copyValue={codeBlock.copyValue}
      language={codeBlock.language}
      label={codeBlock.label}
    />
  );
}

export function createSectionBlockKey(block: SectionBlock, index: number) {
  const label = block.type === 'code' || block.type === 'package-manager' ? block.label : undefined;

  return `${block.type}-${index}-${label ?? 'block'}`;
}
