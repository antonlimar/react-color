import { AnchorHeading } from './AnchorHeading';
import { ApiDefaultValue } from './ApiDefaultValue';
import { CodeFigure } from './CodeFigure';
import { renderInlineCode } from './inlineContent';
import type {
  ApiProperty,
  CodeBlock,
  ContentSection,
  ContentSubsection,
  PackageManager,
  PropertyGroup,
  SectionBlock,
} from '../content';

export const packageManagers: PackageManager[] = ['npm', 'pnpm', 'yarn', 'bun'];

export function createPropertyGroupAnchorId(subsection: ContentSubsection, group: PropertyGroup) {
  return `${subsection.id}-${group.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

function createAnchorSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function createPropertyAnchorId(subsection: ContentSubsection, group: PropertyGroup, property: ApiProperty) {
  return `${createPropertyGroupAnchorId(subsection, group)}-${createAnchorSlug(property.name)}`;
}

export function getPropertyGroupAnchorId(subsection: ContentSubsection, group: PropertyGroup) {
  return subsection.id === 'picker-specific-props' ? createPropertyGroupAnchorId(subsection, group) : undefined;
}

export function getPropertyAnchorId(subsection: ContentSubsection, group: PropertyGroup, property: ApiProperty) {
  return subsection.id === 'picker-specific-props' ? createPropertyAnchorId(subsection, group, property) : undefined;
}

export function stripSearchText(value: string) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getSearchableBlockText(block: SectionBlock) {
  if (block.type === 'text') {
    return block.text;
  }

  if (block.type === 'bullets') {
    return block.items.join(' ');
  }

  if (block.type === 'package-manager') {
    return [block.label, ...Object.values(block.commands)].filter(Boolean).join(' ');
  }

  return [block.label, block.code].filter(Boolean).join(' ');
}

export interface RenderBlockOptions {
  packageManager: PackageManager;
  setPackageManager: (manager: PackageManager) => void;
}

function renderBlock(block: SectionBlock, index: number, options: RenderBlockOptions) {
  if (block.type === 'text') {
    return (
      <p className="content-text" key={`text-${index}`}>
        {renderInlineCode(block.text)}
      </p>
    );
  }

  if (block.type === 'bullets') {
    return (
      <ul className="content-list" key={`bullets-${index}`}>
        {block.items.map((item) => (
          <li key={item}>{renderInlineCode(item)}</li>
        ))}
      </ul>
    );
  }

  if (block.type === 'package-manager') {
    const command = block.commands[options.packageManager];
    const tabs = (
      <div className="package-manager-tabs" role="tablist" aria-label="Package manager">
        {packageManagers.map((manager) => (
          <button
            className={`package-manager-tabs__tab${
              options.packageManager === manager ? ' package-manager-tabs__tab--active' : ''
            }`}
            key={manager}
            type="button"
            role="tab"
            aria-selected={options.packageManager === manager}
            onClick={() => options.setPackageManager(manager)}
          >
            {manager}
          </button>
        ))}
      </div>
    );

    return (
      <CodeFigure
        code={command}
        key={`package-manager-${index}-${block.label ?? 'snippet'}`}
        language="bash"
        label={block.label}
        packageManagerControls={tabs}
      />
    );
  }

  const codeBlock = block as CodeBlock;

  return (
    <CodeFigure
      code={codeBlock.code}
      copyValue={codeBlock.copyValue}
      key={`code-${index}-${codeBlock.label ?? 'snippet'}`}
      language={codeBlock.language}
      label={codeBlock.label}
    />
  );
}

function ApiPropertyName({ property }: { property: ApiProperty }) {
  return <>{renderInlineCode(property.name)}</>;
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
            <p>{renderInlineCode(property.description)}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function renderSection(section: ContentSection, options: RenderBlockOptions) {
  return (
    <section className="section" id={section.id} key={section.id}>
      <div className="section__panel">
        <div className="section__body">
          <AnchorHeading anchorId={section.id} level={2}>
            {section.title}
          </AnchorHeading>
          {section.intro ? <p className="section__intro">{renderInlineCode(section.intro)}</p> : null}
          {section.blocks.map((block, index) => renderBlock(block, index, options))}

          {section.subsections?.map((subsection) => (
            <div className="section__subsection" id={subsection.id} key={subsection.id}>
              <AnchorHeading anchorId={subsection.id} level={3}>
                {subsection.title}
              </AnchorHeading>
              {subsection.intro ? (
                <p className="section__intro section__intro--subsection">{renderInlineCode(subsection.intro)}</p>
              ) : null}
              {subsection.blocks?.map((block, index) => renderBlock(block, index, options))}

              {subsection.propertyGroups?.map((group) => {
                const groupAnchorId = createPropertyGroupAnchorId(subsection, group);

                return (
                  <div className="api-group" id={groupAnchorId} key={group.title}>
                    <div className="api-group__head">
                      <AnchorHeading anchorId={groupAnchorId} level={4}>
                        {group.title}
                      </AnchorHeading>
                      {group.summary ? <p>{renderInlineCode(group.summary)}</p> : null}
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
                              <td>{renderInlineCode(property.description)}</td>
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
