import { highlightCode } from '../../../utils/highlightCode';
import { useCodeCopy } from '../../CodeFigure';
import type { PickerMetadata } from '../../../content';
import './PickerImportSnippet.scss';

interface PickerImportSnippetProps {
  picker: PickerMetadata;
  code: string;
}

export function PickerImportSnippet({ picker, code }: PickerImportSnippetProps) {
  const { buttonLabel, copyState, handleCopy, statusLabel } = useCodeCopy(code);

  return (
    <div className="picker-gallery__imports">
      <div className="picker-gallery__imports-header">
        <span>Import</span>
        <button
          className={`content-code__copy content-code__copy--${copyState} picker-gallery__copy`}
          type="button"
          onClick={handleCopy}
          aria-label={`${buttonLabel}: ${picker.title} import`}
        >
          {buttonLabel}
        </button>
      </div>
      <pre>
        <code className="language-tsx" dangerouslySetInnerHTML={{ __html: highlightCode(code, 'tsx') }} />
      </pre>
      <span className="picker-gallery__status" aria-live="polite">
        {statusLabel}
      </span>
    </div>
  );
}
