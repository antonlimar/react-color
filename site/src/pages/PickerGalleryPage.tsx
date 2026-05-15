import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';

interface PickerGalleryPageProps {
  gallery: ReactNode;
  galleryNote: string;
  intro: string;
  pickerCount: number;
}

export function PickerGalleryPage({ gallery, galleryNote, intro, pickerCount }: PickerGalleryPageProps) {
  return (
    <main className="sections-shell sections-shell--gallery-page" id="site-documentation">
      <div className="gallery-page">
        <nav className="page-breadcrumbs" aria-label="Page navigation">
          <Link to="/" hash="about">
            Documentation
          </Link>
          <span aria-hidden="true">/</span>
          <span>Picker Gallery</span>
        </nav>

        <section className="gallery-page__intro" id="picker-gallery" aria-labelledby="picker-gallery-title">
          <p className="eyebrow">Picker Gallery</p>
          <div className="gallery-page__intro-grid">
            <div>
              <h2 id="picker-gallery-title">Find the picker that fits the job.</h2>
              <p>{intro}</p>
            </div>
            <div className="gallery-page__note">
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
