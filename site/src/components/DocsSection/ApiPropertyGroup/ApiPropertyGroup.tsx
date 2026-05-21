import type { ContentSubsection, PropertyGroup } from '../../../content';
import { createPropertyGroupAnchorId, siteBem } from '../../../utils';
import { AnchorHeading } from '../../AnchorHeading';
import { ApiDefaultValue } from '../../ApiDefaultValue';
import { InlineContent } from '../../InlineContent';
import { ApiPropertyCards } from '../ApiPropertyCards';
import { ApiPropertyName } from '../ApiPropertyName';
import './ApiPropertyGroup.scss';

interface ApiPropertyGroupProps {
  group: PropertyGroup;
  subsection: ContentSubsection;
}

export function ApiPropertyGroup({ group, subsection }: ApiPropertyGroupProps) {
  const groupAnchorId = createPropertyGroupAnchorId(subsection, group);
  const b = siteBem('api-group');
  const table = siteBem('api-table');
  const type = siteBem('api-type');

  return (
    <div className={b()} id={groupAnchorId}>
      <div className={b('head')}>
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
        <table className={table()}>
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
                  <code className={type()}>{property.type}</code>
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
