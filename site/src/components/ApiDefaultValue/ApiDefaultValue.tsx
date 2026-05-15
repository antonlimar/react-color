import { useState } from 'react';
import './ApiDefaultValue.scss';

interface ApiDefaultValueProps {
  value?: string;
}

export function ApiDefaultValue({ value }: ApiDefaultValueProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!value) {
    return <span className="api-default api-default--empty">None</span>;
  }

  const isLongDefault = value.length > 48;

  if (!isLongDefault) {
    return <code className="api-default">{value}</code>;
  }

  return (
    <div className={`api-default api-default--long${isExpanded ? ' api-default--expanded' : ''}`}>
      <button className="api-default__toggle" type="button" onClick={() => setIsExpanded((current) => !current)}>
        {isExpanded ? 'Hide default' : 'Show default'}
      </button>
      {isExpanded ? <code className="api-default__value">{value}</code> : null}
    </div>
  );
}
