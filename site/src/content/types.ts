export type SectionId = 'about' | 'getting-started' | 'component-api' | 'create-your-own';

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
  language: 'bash' | 'css' | 'tsx';
  code: string;
  label?: string;
}

export type SectionBlock = TextBlock | BulletListBlock | CodeBlock;

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
