import { useCallback, useEffect, useRef, useState } from 'react';
import { copyText } from './clipboard';

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
