import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { highlightCode } from '../../utils/highlightCode';
import { copyText } from './clipboard';
import type { CodeBlock } from '../../content';
import './CodeFigure.scss';

interface CodeFigureProps {
  code: string;
  language: CodeBlock['language'];
  label?: string;
  copyValue?: string;
  packageManagerControls?: ReactNode;
}

type CodeCopyState = 'idle' | 'copied' | 'error';

export function useCodeCopy(valueToCopy: string) {
  const [copyState, setCopyState] = useState<CodeCopyState>('idle');
  const timeoutRef = useRef<number | undefined>(undefined);
  const buttonLabel = copyState === 'copied' ? 'Copied' : copyState === 'error' ? 'Retry Copy' : 'Copy';
  const statusLabel =
    copyState === 'copied'
      ? 'Code copied to clipboard.'
      : copyState === 'error'
        ? 'Copy failed. Try again.'
        : 'Copy code to clipboard.';

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

  return (
    <figure className="content-code">
      <div className="content-code__header">
        <div className="content-code__meta">
          {label ? <figcaption>{label}</figcaption> : null}
          <span className="content-code__language">{language}</span>
        </div>
        <button
          className={`content-code__copy content-code__copy--${copyState}`}
          type="button"
          onClick={handleCopy}
          aria-label={`${buttonLabel}: ${label ?? `${language} snippet`}`}
        >
          {buttonLabel}
        </button>
      </div>

      {packageManagerControls}

      <pre>
        <code className={`language-${language}`} dangerouslySetInnerHTML={{ __html: highlightCode(code, language) }} />
      </pre>
      <span className="content-code__status" aria-live="polite">
        {statusLabel}
      </span>
    </figure>
  );
}
