import type { PropertyGroup } from '../../../content';
import { siteBem } from '../../../utils';
import { ApiDefaultValue } from '../../ApiDefaultValue';
import { InlineContent } from '../../InlineContent';
import { ApiPropertyName } from '../ApiPropertyName';
import './ApiPropertyCards.scss';

interface ApiPropertyCardsProps {
  group: PropertyGroup;
}

export function ApiPropertyCards({ group }: ApiPropertyCardsProps) {
  if (group.properties.length === 0) {
    return null;
  }

  const cards = siteBem('api-prop-cards');
  const card = siteBem('api-prop-card');

  return (
    <div className={cards()} aria-label={`${group.title} props`}>
      {group.properties.map((property) => (
        <article className={card()} key={`${group.title}-${property.name}-card`}>
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
