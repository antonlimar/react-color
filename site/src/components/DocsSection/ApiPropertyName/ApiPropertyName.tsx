import type { ApiProperty } from '../../../content';
import { InlineContent } from '../../InlineContent';

interface ApiPropertyNameProps {
  property: ApiProperty;
}

export function ApiPropertyName({ property }: ApiPropertyNameProps) {
  return <InlineContent text={property.name} />;
}
