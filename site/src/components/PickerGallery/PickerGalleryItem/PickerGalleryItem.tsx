import { Link } from '@tanstack/react-router';
import { LivePickerPreview } from '../LivePickerPreview';
import { PickerImportSnippet } from '../PickerImportSnippet';
import type { PickerMetadata } from '../../../content';
import type { ColorResult, RGBAColor } from 'react-color';
import './PickerGalleryItem.scss';

interface PickerGalleryItemProps {
  color: RGBAColor;
  colorLabel: string;
  onChange: (color: ColorResult) => void;
  picker: PickerMetadata;
}

export function PickerGalleryItem({ color, colorLabel, onChange, picker }: PickerGalleryItemProps) {
  const importSnippet = `import { ${picker.exportName} } from 'react-color';`;

  return (
    <article className="picker-gallery__item" id={`picker-${picker.id}`}>
      <LivePickerPreview picker={picker} color={color} onChange={onChange} />
      <div className="picker-gallery__content">
        <div className="picker-gallery__head">
          <h3>{picker.title}</h3>
          <div className="picker-gallery__meta">
            <code>{picker.exportName}</code>
            <span>{colorLabel}</span>
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
}
