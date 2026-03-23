declare module 'reactcss' {
  const reactCSS: (styles: Record<string, unknown>) => Record<string, any>;
  export default reactCSS;
}

declare module 'markdown-it' {
  interface MarkdownItOptions {
    html?: boolean;
    typographer?: boolean;
    breaks?: boolean;
    highlight?: (source: string, language: string) => string;
  }

  export default class MarkdownIt {
    constructor(options?: MarkdownItOptions);
    render(source: string): string;
  }
}

declare module 'react-dom/client' {
  import type { ReactNode } from 'react';

  interface Root {
    render(children: ReactNode): void;
  }

  export function createRoot(container: Element | DocumentFragment): Root;
}

declare module 'react-color' {
  import type { ComponentType } from 'react';

  export const AlphaPicker: ComponentType<any>;
  export const BlockPicker: ComponentType<any>;
  export const ChromePicker: ComponentType<any>;
  export const CirclePicker: ComponentType<any>;
  export const CompactPicker: ComponentType<any>;
  export const GithubPicker: ComponentType<any>;
  export const HuePicker: ComponentType<any>;
  export const MaterialPicker: ComponentType<any>;
  export const PhotoshopPicker: ComponentType<any>;
  export const SketchPicker: ComponentType<any>;
  export const SliderPicker: ComponentType<any>;
  export const SwatchesPicker: ComponentType<any>;
  export const TwitterPicker: ComponentType<any>;
}
