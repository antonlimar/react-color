import type { PickerMetadata } from '../../../content';
import { highlightCode, siteBem } from '../../../utils';
import { useCodeCopy } from '../../CodeFigure';
import './PickerImportSnippet.scss';

interface PickerImportSnippetProps {
  picker: PickerMetadata;
  code: string;
}

export function PickerImportSnippet({ picker, code }: PickerImportSnippetProps) {
  const { buttonLabel, copyState, handleCopy, statusLabel } = useCodeCopy(code);
  const gallery = siteBem('picker-gallery');
  const contentCode = siteBem('content-code');
  const languageTsx = siteBem('language-tsx');

  return (
    <div className={gallery('imports')}>
      <div className={gallery('imports-header')}>
        <span>Import</span>
        <button
          className={contentCode('copy', { [copyState]: true }).mix(gallery('copy'))}
          type="button"
          onClick={handleCopy}
          aria-label={`${buttonLabel}: ${picker.title} import`}
        >
          {buttonLabel}
        </button>
      </div>
      <pre>
        <code className={languageTsx()} dangerouslySetInnerHTML={{ __html: highlightCode(code, 'tsx') }} />
      </pre>
      <span className={gallery('status')} aria-live="polite">
        {statusLabel}
      </span>
    </div>
  );
}
