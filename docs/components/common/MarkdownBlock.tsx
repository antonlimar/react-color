import type { CSSProperties, ReactNode } from 'react';
import highlightJs from 'highlight.js';
import MarkdownIt from 'markdown-it';

interface FrontmatterFields {
  id?: string;
  title?: string;
  [key: string]: string | undefined;
}

export interface ParsedFrontmatter {
  body: string;
  id: string | null;
  title: string | null;
}

export interface MarkdownBlockProps {
  children?: string | null;
  className?: string;
  style?: CSSProperties;
}

export interface MarkdownDocumentProps {
  document: string;
  headingStyle?: CSSProperties;
  contentStyle?: CSSProperties;
  wrapperStyle?: CSSProperties;
  children?: ReactNode;
}

const markdown = new MarkdownIt({
  html: false,
  typographer: false,
  breaks: false,
  highlight(source: string, language: string) {
    const className = language ? `hljs language-${language}` : 'hljs';

    if (language && highlightJs.getLanguage(language)) {
      const value = highlightJs.highlight(source, {
        language,
        ignoreIllegals: true,
      }).value;

      return `<pre><code class="${className}">${value}</code></pre>`;
    }

    const value = highlightJs.highlightAuto(source).value;
    return `<pre><code class="${className}">${value}</code></pre>`;
  },
});

export function parseFrontmatter(document: string): ParsedFrontmatter {
  const match = document.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!match) {
    return {
      body: document,
      id: null,
      title: null,
    };
  }

  const [, rawFrontmatter, body] = match;
  const fields = rawFrontmatter.split('\n').reduce<FrontmatterFields>((result, line) => {
    const separatorIndex = line.indexOf(':');

    if (separatorIndex === -1) {
      return result;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    return { ...result, [key]: value };
  }, {});

  return {
    body,
    id: fields.id ?? null,
    title: fields.title ?? null,
  };
}

export function MarkdownBlock({ children, className, style }: MarkdownBlockProps) {
  const html = markdown.render(children ?? '');

  return <div className={className} style={style} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function MarkdownDocument({ document, headingStyle, contentStyle, wrapperStyle }: MarkdownDocumentProps) {
  const { body, id, title } = parseFrontmatter(document);

  return (
    <section id={id ?? undefined} style={wrapperStyle}>
      {title ? <h2 style={headingStyle}>{title}</h2> : null}
      <MarkdownBlock style={contentStyle}>{body}</MarkdownBlock>
    </section>
  );
}

export default MarkdownBlock;
