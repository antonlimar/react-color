import type { ReactNode } from 'react';
import type { CodeBlock } from '../../content';
import { highlightCode, siteBem } from '../../utils';
import { useCodeCopy } from './useCodeCopy';
import './CodeFigure.scss';

interface CodeFigureProps {
  code: string;
  language: CodeBlock['language'];
  label?: string;
  copyValue?: string;
  packageManagerControls?: ReactNode;
}

export function CodeFigure({ code, language, label, copyValue, packageManagerControls }: CodeFigureProps) {
  const valueToCopy = copyValue ?? code;
  const { buttonLabel, copyState, handleCopy, statusLabel } = useCodeCopy(valueToCopy);
  const b = siteBem('content-code');
  const languageClassName = siteBem(`language-${language}`);

  return (
    <figure className={b()}>
      <div className={b('header')}>
        <div className={b('meta')}>
          {label ? <figcaption>{label}</figcaption> : null}
          <span className={b('language')}>{language}</span>
        </div>
        <button
          className={b('copy', { [copyState]: true })}
          type="button"
          onClick={() => {
            void handleCopy();
          }}
          aria-label={`${buttonLabel}: ${label ?? `${language} snippet`}`}
        >
          {buttonLabel}
        </button>
      </div>

      {packageManagerControls}

      <pre>
        <code className={languageClassName()} dangerouslySetInnerHTML={{ __html: highlightCode(code, language) }} />
      </pre>
      <span className={b('status')} aria-live="polite">
        {statusLabel}
      </span>
    </figure>
  );
}
