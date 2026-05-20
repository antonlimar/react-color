import { Link } from '@tanstack/react-router';
import type { ColorResult, PickerTheme, RGBAColor } from '@antonlimar/react-color';
import type { PickerMetadata } from '../../../content';
import { siteBem } from '../../../utils/siteBem';
import { LivePickerPreview } from '../LivePickerPreview';
import { PickerImportSnippet } from '../PickerImportSnippet';
import './PickerGalleryItem.scss';

interface PickerGalleryItemProps {
  color: RGBAColor;
  colorLabel: string;
  theme: PickerTheme;
  onChange: (color: ColorResult) => void;
  picker: PickerMetadata;
}

export function PickerGalleryItem({ color, colorLabel, theme, onChange, picker }: PickerGalleryItemProps) {
  const importSnippet = `import { ${picker.exportName} } from '@antonlimar/react-color';`;
  const b = siteBem('picker-gallery');

  return (
    <article className={b('item')} id={`picker-${picker.id}`}>
      <LivePickerPreview picker={picker} color={color} theme={theme} onChange={onChange} />
      <div className={b('content')}>
        <div className={b('head')}>
          <h3>{picker.title}</h3>
          <div className={b('meta')}>
            <code>{picker.exportName}</code>
            <span>{colorLabel}</span>
          </div>
        </div>
        <p>{picker.summary}</p>
        <div className={b('badges')} aria-label={`${picker.title} capabilities`}>
          {picker.badges.map((badge) => (
            <span key={`${picker.id}-${badge}`}>{badge}</span>
          ))}
        </div>
        <PickerImportSnippet picker={picker} code={importSnippet} />
        <Link className={b('api-link')} to="/" hash={picker.apiAnchor}>
          API props
        </Link>
      </div>
    </article>
  );
}
