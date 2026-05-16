import { InlineContent } from '../../InlineContent';
import type { ApiProperty } from '../../../content';

interface ApiPropertyNameProps {
  property: ApiProperty;
}

export function ApiPropertyName({ property }: ApiPropertyNameProps) {
  return <InlineContent text={property.name} />;
}
