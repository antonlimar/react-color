import type { SectionBlock } from '../../../content';

export function createSectionBlockKey(block: SectionBlock, index: number) {
  const label = block.type === 'code' || block.type === 'package-manager' ? block.label : undefined;

  return `${block.type}-${index}-${label ?? 'block'}`;
}
