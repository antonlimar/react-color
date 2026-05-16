import { AnchorHeading } from '../AnchorHeading';
import { InlineContent } from '../InlineContent';
import { ApiPropertyGroup } from './ApiPropertyGroup';
import { SectionBlockView, createSectionBlockKey } from './SectionBlockView';
import type { ContentSection, PackageManager } from '../../content';
import './DocsSection.scss';

interface DocsSectionProps {
  packageManager: PackageManager;
  section: ContentSection;
  setPackageManager: (manager: PackageManager) => void;
}

export function DocsSection({ section, packageManager, setPackageManager }: DocsSectionProps) {
  return (
    <section className="section" id={section.id}>
      <div className="section__panel">
        <div className="section__body">
          <AnchorHeading anchorId={section.id} level={2}>
            {section.title}
          </AnchorHeading>
          {section.intro ? (
            <p className="section__intro">
              <InlineContent text={section.intro} />
            </p>
          ) : null}
          {section.blocks.map((block, index) => (
            <SectionBlockView
              block={block}
              key={createSectionBlockKey(block, index)}
              packageManager={packageManager}
              setPackageManager={setPackageManager}
            />
          ))}
          {section.subsections?.map((subsection) => (
            <div className="section__subsection" id={subsection.id} key={subsection.id}>
              <AnchorHeading anchorId={subsection.id} level={3}>
                {subsection.title}
              </AnchorHeading>
              {subsection.intro ? (
                <p className="section__intro section__intro--subsection">
                  <InlineContent text={subsection.intro} />
                </p>
              ) : null}
              {subsection.blocks?.map((block, index) => (
                <SectionBlockView
                  block={block}
                  key={createSectionBlockKey(block, index)}
                  packageManager={packageManager}
                  setPackageManager={setPackageManager}
                />
              ))}
              {subsection.propertyGroups?.map((group) => (
                <ApiPropertyGroup group={group} key={group.title} subsection={subsection} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
