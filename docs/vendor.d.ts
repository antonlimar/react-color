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
