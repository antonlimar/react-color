import type { CSSProperties, ReactNode } from 'react';
import MarkdownIt from 'markdown-it';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';

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

const prismMarkdownStyles = `
.markdown-prism pre {
  overflow-x: auto;
  margin: 0;
}

.markdown-prism code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;
}

.markdown-prism .token.keyword,
.markdown-prism .token.selector,
.markdown-prism .token.atrule,
.markdown-prism .token.rule,
.markdown-prism .token.property,
.markdown-prism .token.class-name {
  color: #ff8f70;
}

.markdown-prism .token.string,
.markdown-prism .token.attr-value,
.markdown-prism .token.template-string,
.markdown-prism .token.regex {
  color: #b8f07a;
}

.markdown-prism .token.tag,
.markdown-prism .token.attr-name,
.markdown-prism .token.function,
.markdown-prism .token.builtin,
.markdown-prism .token.constant,
.markdown-prism .token.namespace {
  color: #7fd6ff;
}

.markdown-prism .token.comment,
.markdown-prism .token.prolog,
.markdown-prism .token.doctype,
.markdown-prism .token.cdata {
  color: rgba(214, 225, 244, 0.52);
}

.markdown-prism .token.number,
.markdown-prism .token.boolean,
.markdown-prism .token.symbol,
.markdown-prism .token.unit {
  color: #ffd166;
}

.markdown-prism .token.parameter,
.markdown-prism .token.script,
.markdown-prism .token.operator,
.markdown-prism .token.punctuation,
.markdown-prism .token.plain-text {
  color: inherit;
}
`;

function escapeHtml(code: string) {
  return code
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function highlightCode(source: string, language: string) {
  const prismLanguage =
    language === 'tsx'
      ? Prism.languages.tsx
      : language === 'typescript' || language === 'ts'
        ? Prism.languages.typescript
        : language === 'jsx'
          ? Prism.languages.jsx
          : language === 'javascript' || language === 'js'
            ? Prism.languages.javascript
            : language === 'css'
              ? Prism.languages.css
              : language === 'bash' || language === 'sh' || language === 'shell'
                ? Prism.languages.bash
                : undefined;

  if (!prismLanguage) {
    return `<pre><code class="language-${language}">${escapeHtml(source)}</code></pre>`;
  }

  return `<pre><code class="language-${language}">${Prism.highlight(source, prismLanguage, language)}</code></pre>`;
}

const markdown = new MarkdownIt({
  html: false,
  typographer: false,
  breaks: false,
  highlight(source: string, language: string) {
    return highlightCode(source, language);
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

  return (
    <>
      <style>{prismMarkdownStyles}</style>
      <div
        className={className ? `markdown-prism ${className}` : 'markdown-prism'}
        style={style}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
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
