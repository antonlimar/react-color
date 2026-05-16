import { createPropertyGroupAnchorId } from '../../../utils/docsSections';
import { AnchorHeading } from '../../AnchorHeading';
import { ApiDefaultValue } from '../../ApiDefaultValue';
import { InlineContent } from '../../InlineContent';
import { ApiPropertyCards } from '../ApiPropertyCards';
import { ApiPropertyName } from '../ApiPropertyName';
import type { ContentSubsection, PropertyGroup } from '../../../content';
import './ApiPropertyGroup.scss';

interface ApiPropertyGroupProps {
  group: PropertyGroup;
  subsection: ContentSubsection;
}

export function ApiPropertyGroup({ group, subsection }: ApiPropertyGroupProps) {
  const groupAnchorId = createPropertyGroupAnchorId(subsection, group);

  return (
    <div className="api-group" id={groupAnchorId}>
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

      <ApiPropertyCards group={group} />
    </div>
  );
}
