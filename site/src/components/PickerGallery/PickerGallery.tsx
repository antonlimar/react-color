import { Link } from '@tanstack/react-router';
import { useCallback } from 'react';
import {
  AlphaPicker,
  BlockPicker,
  ChromePicker,
  CirclePicker,
  CompactPicker,
  GithubPicker,
  GooglePicker,
  HuePicker,
  MaterialPicker,
  PhotoshopPicker,
  SketchPicker,
  SliderPicker,
  SwatchesPicker,
  TwitterPicker,
} from 'react-color';
import { pickerMetadata } from '../../content';
import { colorToHex } from '../../utils/colorUtils';
import { highlightCode } from '../../utils/highlightCode';
import { useCodeCopy } from '../CodeFigure';
import type { PickerMetadata } from '../../content';
import type { ColorPickerComponent, ColorPickerProps, ColorResult, RGBAColor } from 'react-color';
import './PickerGallery.scss';

export const pickerGalleryComponents: Record<string, ColorPickerComponent> = {
  alpha: AlphaPicker,
  block: BlockPicker,
  chrome: ChromePicker,
  circle: CirclePicker,
  compact: CompactPicker,
  github: GithubPicker,
  google: GooglePicker,
  hue: HuePicker,
  material: MaterialPicker,
  photoshop: PhotoshopPicker,
  sketch: SketchPicker,
  slider: SliderPicker,
  swatches: SwatchesPicker,
  twitter: TwitterPicker,
};

const pickerGalleryPreviewProps: Record<string, ColorPickerProps> = {
  alpha: { width: '100%' },
  google: { width: 420 },
  hue: { width: '100%' },
  photoshop: {
    onCancel: () => undefined,
    styles: { default: { picker: { boxShadow: 'var(--site-picker-gallery-shadow)' } } },
  },
  slider: { styles: { default: { wrap: { width: '100%' } } } },
  swatches: { width: 320, height: 220 },
};

interface LivePickerPreviewProps {
  picker: PickerMetadata;
  color: RGBAColor;
  onChange: (color: ColorResult) => void;
}

function LivePickerPreview({ picker, color, onChange }: LivePickerPreviewProps) {
  const PickerComponent = pickerGalleryComponents[picker.id];

  if (!PickerComponent) {
    return null;
  }

  return (
    <div
      className={`picker-gallery__preview picker-gallery__preview--${picker.id}`}
      aria-label={`${picker.title} live demo`}
    >
      <div className="picker-gallery__live">
        <PickerComponent
          color={color}
          onChange={onChange}
          onAccept={onChange}
          {...(pickerGalleryPreviewProps[picker.id] ?? {})}
        />
      </div>
    </div>
  );
}

interface PickerImportSnippetProps {
  picker: PickerMetadata;
  code: string;
}

function PickerImportSnippet({ picker, code }: PickerImportSnippetProps) {
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

interface PickerGalleryProps {
  color: RGBAColor;
  onChange: (color: ColorResult) => void;
}

export function PickerGallery({ color, onChange }: PickerGalleryProps) {
  const handleGalleryColorChange = useCallback(
    (nextColor: ColorResult) => {
      onChange(nextColor);
    },
    [onChange],
  );
  const galleryColorLabel = colorToHex(color);

  return (
    <div className="picker-gallery" aria-label="Public picker components">
      {pickerMetadata.map((picker) => {
        const importSnippet = `import { ${picker.exportName} } from 'react-color';`;

        return (
          <article className="picker-gallery__item" id={`picker-${picker.id}`} key={picker.id}>
            <LivePickerPreview picker={picker} color={color} onChange={handleGalleryColorChange} />
            <div className="picker-gallery__content">
              <div className="picker-gallery__head">
                <h3>{picker.title}</h3>
                <div className="picker-gallery__meta">
                  <code>{picker.exportName}</code>
                  <span>{galleryColorLabel}</span>
                </div>
              </div>
              <p>{picker.summary}</p>
              <div className="picker-gallery__badges" aria-label={`${picker.title} capabilities`}>
                {picker.badges.map((badge) => (
                  <span key={`${picker.id}-${badge}`}>{badge}</span>
                ))}
              </div>
              <PickerImportSnippet picker={picker} code={importSnippet} />
              <Link className="picker-gallery__api-link" to="/" hash={picker.apiAnchor}>
                API props
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
