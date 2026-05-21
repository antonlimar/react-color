import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { siteBem } from '../../utils';
import './PickerGalleryPage.scss';

interface PickerGalleryPageProps {
  gallery: ReactNode;
  galleryNote: string;
  intro: string;
  pickerCount: number;
}

export function PickerGalleryPage({ gallery, galleryNote, intro, pickerCount }: PickerGalleryPageProps) {
  const sectionsShell = siteBem('sections-shell');
  const galleryPage = siteBem('gallery-page');
  const breadcrumbs = siteBem('page-breadcrumbs');
  const eyebrow = siteBem('eyebrow');

  return (
    <main className={sectionsShell({ 'gallery-page': true })} id="site-documentation">
      <div className={galleryPage()}>
        <nav className={breadcrumbs()} aria-label="Page navigation">
          <Link to="/" hash="about">
            Documentation
          </Link>
          <span aria-hidden="true">/</span>
          <span>Picker Gallery</span>
        </nav>
        <section className={galleryPage('intro')} id="picker-gallery" aria-labelledby="picker-gallery-title">
          <p className={eyebrow()}>Picker Gallery</p>
          <div className={galleryPage('intro-grid')}>
            <div>
              <h2 id="picker-gallery-title">Find the picker that fits the job.</h2>
              <p>{intro}</p>
            </div>
            <div className={galleryPage('note')}>
              <strong>{pickerCount} picker exports</strong>
              <span>{galleryNote}</span>
            </div>
          </div>
        </section>
        {gallery}
      </div>
    </main>
  );
}
