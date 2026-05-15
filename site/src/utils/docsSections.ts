import type { ApiProperty, ContentSubsection, PackageManager, PropertyGroup, SectionBlock } from '../content';

export const packageManagers: PackageManager[] = ['npm', 'pnpm', 'yarn', 'bun'];

export function createPropertyGroupAnchorId(subsection: ContentSubsection, group: PropertyGroup) {
  return `${subsection.id}-${group.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

function createAnchorSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function createPropertyAnchorId(subsection: ContentSubsection, group: PropertyGroup, property: ApiProperty) {
  return `${createPropertyGroupAnchorId(subsection, group)}-${createAnchorSlug(property.name)}`;
}

export function getPropertyGroupAnchorId(subsection: ContentSubsection, group: PropertyGroup) {
  return subsection.id === 'picker-specific-props' ? createPropertyGroupAnchorId(subsection, group) : undefined;
}

export function getPropertyAnchorId(subsection: ContentSubsection, group: PropertyGroup, property: ApiProperty) {
  return subsection.id === 'picker-specific-props' ? createPropertyAnchorId(subsection, group, property) : undefined;
}

export function stripSearchText(value: string) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getSearchableBlockText(block: SectionBlock) {
  if (block.type === 'text') {
    return block.text;
  }

  if (block.type === 'bullets') {
    return block.items.join(' ');
  }

  if (block.type === 'package-manager') {
    return [block.label, ...Object.values(block.commands)].filter(Boolean).join(' ');
  }

  return [block.label, block.code].filter(Boolean).join(' ');
}
