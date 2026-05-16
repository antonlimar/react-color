import { ApiDefaultValue } from '../../ApiDefaultValue';
import { InlineContent } from '../../InlineContent';
import { ApiPropertyName } from '../ApiPropertyName';
import type { PropertyGroup } from '../../../content';
import './ApiPropertyCards.scss';

interface ApiPropertyCardsProps {
  group: PropertyGroup;
}

export function ApiPropertyCards({ group }: ApiPropertyCardsProps) {
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
