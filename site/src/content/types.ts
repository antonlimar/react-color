export type SectionId = 'about' | 'getting-started' | 'picker-gallery' | 'component-api' | 'create-your-own';

export interface TextBlock {
  type: 'text';
  text: string;
}

export interface BulletListBlock {
  type: 'bullets';
  items: string[];
}

export interface CodeBlock {
  type: 'code';
  language: 'bash' | 'css' | 'ts' | 'tsx' | 'js' | 'jsx';
  code: string;
  label?: string;
  copyValue?: string;
}

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export interface PackageManagerBlock {
  type: 'package-manager';
  label?: string;
  commands: Record<PackageManager, string>;
}

export type SectionBlock = TextBlock | BulletListBlock | CodeBlock | PackageManagerBlock;

export interface ApiProperty {
  name: string;
  type: string;
  description: string;
  defaultValue?: string;
}

export interface PropertyGroup {
  title: string;
  summary?: string;
  properties: ApiProperty[];
}

export interface PickerMetadata {
  id: string;
  title: string;
  exportName: string;
  deepImport: string;
  summary: string;
  badges: string[];
  apiAnchor: string;
}

export interface ContentSubsection {
  id: string;
  title: string;
  intro?: string;
  blocks?: SectionBlock[];
  propertyGroups?: PropertyGroup[];
}

export interface ContentSection {
  id: SectionId;
  order: number;
  title: string;
  intro?: string;
  blocks: SectionBlock[];
  subsections?: ContentSubsection[];
}
