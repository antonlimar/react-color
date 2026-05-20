import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { CodeBlock } from '../../content';
import { highlightCode } from '../../utils/highlightCode';
import { siteBem } from '../../utils/siteBem';
import { copyText } from './clipboard';
import './CodeFigure.scss';

interface CodeFigureProps {
  code: string;
  language: CodeBlock['language'];
  label?: string;
  copyValue?: string;
  packageManagerControls?: ReactNode;
}

type CodeCopyState = 'idle' | 'copied' | 'error';

function getCopyLabels(copyState: CodeCopyState) {
  switch (copyState) {
    case 'copied':
      return {
        buttonLabel: 'Copied',
        statusLabel: 'Code copied to clipboard.',
      };
    case 'error':
      return {
        buttonLabel: 'Retry Copy',
        statusLabel: 'Copy failed. Try again.',
      };
    case 'idle':
      return {
        buttonLabel: 'Copy',
        statusLabel: 'Copy code to clipboard.',
      };
  }
}

export function useCodeCopy(valueToCopy: string) {
  const [copyState, setCopyState] = useState<CodeCopyState>('idle');
  const timeoutRef = useRef<number | undefined>(undefined);
  const { buttonLabel, statusLabel } = getCopyLabels(copyState);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = useCallback(async () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    try {
      await copyText(valueToCopy);
      setCopyState('copied');
      timeoutRef.current = window.setTimeout(() => {
        setCopyState('idle');
      }, 1800);
    } catch {
      setCopyState('error');
    }
  }, [valueToCopy]);

  return {
    buttonLabel,
    copyState,
    handleCopy,
    statusLabel,
  };
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
          onClick={handleCopy}
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
