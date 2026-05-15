import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';
import type { CodeBlock } from '../content';

function escapeHtml(code: string) {
  return code
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function highlightCode(code: string, language: CodeBlock['language']) {
  const prismLanguage =
    language === 'tsx'
      ? Prism.languages.tsx
      : language === 'ts'
        ? Prism.languages.typescript
        : language === 'jsx'
          ? Prism.languages.jsx
          : language === 'js'
            ? Prism.languages.javascript
            : language === 'css'
              ? Prism.languages.css
              : language === 'bash'
                ? Prism.languages.bash
                : undefined;

  if (!prismLanguage) {
    return escapeHtml(code);
  }

  return Prism.highlight(code, prismLanguage, language);
}
