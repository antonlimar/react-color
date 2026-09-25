import { highlight, languages } from 'prismjs';
import type { Grammar } from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
// eslint-disable-next-line import-x/order -- prism-tsx depends on prism-typescript being loaded first.
import 'prismjs/components/prism-tsx';
import type { CodeBlock } from '../content';

const prismLanguageByLanguage = {
  bash: languages.bash,
  css: languages.css,
  js: languages.javascript,
  jsx: languages.jsx,
  ts: languages.typescript,
  tsx: languages.tsx,
} satisfies Partial<Record<CodeBlock['language'], Grammar>>;

function escapeHtml(code: string) {
  return code
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function highlightCode(code: string, language: CodeBlock['language']) {
  const prismLanguage = prismLanguageByLanguage[language];

  if (!prismLanguage) {
    return escapeHtml(code);
  }

  return highlight(code, prismLanguage, language);
}
