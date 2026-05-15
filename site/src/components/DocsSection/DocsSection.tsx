import { createPropertyGroupAnchorId, packageManagers } from '../../utils/docsSections';
import { AnchorHeading } from '../AnchorHeading';
import { ApiDefaultValue } from '../ApiDefaultValue';
import { CodeFigure } from '../CodeFigure';
import { InlineContent } from '../InlineContent';
import type {
  ApiProperty,
  CodeBlock,
  ContentSection,
  ContentSubsection,
  PackageManager,
  PropertyGroup,
  SectionBlock,
} from '../../content';

export interface DocsSectionProps {
  packageManager: PackageManager;
  section: ContentSection;
  setPackageManager: (manager: PackageManager) => void;
}

interface SectionBlockViewProps {
  block: SectionBlock;
  packageManager: PackageManager;
  setPackageManager: (manager: PackageManager) => void;
}

function SectionBlockView({ block, packageManager, setPackageManager }: SectionBlockViewProps) {
  if (block.type === 'text') {
    return (
      <p className="content-text">
        <InlineContent text={block.text} />
      </p>
    );
  }

  if (block.type === 'bullets') {
    return (
      <ul className="content-list">
        {block.items.map((item) => (
          <li key={item}>
            <InlineContent text={item} />
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === 'package-manager') {
    const command = block.commands[packageManager];
    const tabs = (
      <div className="package-manager-tabs" role="tablist" aria-label="Package manager">
        {packageManagers.map((manager) => (
          <button
            className={`package-manager-tabs__tab${packageManager === manager ? ' package-manager-tabs__tab--active' : ''}`}
            key={manager}
            type="button"
            role="tab"
            aria-selected={packageManager === manager}
            onClick={() => setPackageManager(manager)}
          >
            {manager}
          </button>
        ))}
      </div>
    );

    return <CodeFigure code={command} language="bash" label={block.label} packageManagerControls={tabs} />;
  }

  const codeBlock = block as CodeBlock;

  return (
    <CodeFigure
      code={codeBlock.code}
      copyValue={codeBlock.copyValue}
      language={codeBlock.language}
      label={codeBlock.label}
    />
  );
}

function createSectionBlockKey(block: SectionBlock, index: number) {
  const label = block.type === 'code' || block.type === 'package-manager' ? block.label : undefined;

  return `${block.type}-${index}-${label ?? 'block'}`;
}

function ApiPropertyName({ property }: { property: ApiProperty }) {
  return <InlineContent text={property.name} />;
}

function ApiPropertyCards({ group }: { group: PropertyGroup; subsection: ContentSubsection }) {
  if (group.properties.length === 0) {
    return null;
  }

  return (
    <div className="api-prop-cards" aria-label={`${group.title} props`}>
      {group.properties.map((property) => (
        <article className="api-prop-card" key={`${group.title}-${property.name}-card`}>
          <div>
            <span>Prop</span>
            <strong>
              <ApiPropertyName property={property} />
            </strong>
          </div>
          <div>
            <span>Type</span>
            <code>{property.type}</code>
          </div>
          <div>
            <span>Default</span>
            <ApiDefaultValue value={property.defaultValue} />
          </div>
          <div>
            <span>Description</span>
            <p>
              <InlineContent text={property.description} />
            </p>
          </div>
        </article>
      ))}
    </div>
  );
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

              {subsection.propertyGroups?.map((group) => {
                const groupAnchorId = createPropertyGroupAnchorId(subsection, group);

                return (
                  <div className="api-group" id={groupAnchorId} key={group.title}>
                    <div className="api-group__head">
                      <AnchorHeading anchorId={groupAnchorId} level={4}>
                        {group.title}
                      </AnchorHeading>
                      {group.summary ? (
                        <p>
                          <InlineContent text={group.summary} />
                        </p>
                      ) : null}
                    </div>

                    {group.properties.length > 0 ? (
                      <table className="api-table">
                        <thead>
                          <tr>
                            <th>Prop</th>
                            <th>Type</th>
                            <th>Default</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.properties.map((property) => (
                            <tr key={`${group.title}-${property.name}`}>
                              <th scope="row">
                                <ApiPropertyName property={property} />
                              </th>
                              <td>
                                <code className="api-type">{property.type}</code>
                              </td>
                              <td>
                                <ApiDefaultValue value={property.defaultValue} />
                              </td>
                              <td>
                                <InlineContent text={property.description} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : null}

                    <ApiPropertyCards group={group} subsection={subsection} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
