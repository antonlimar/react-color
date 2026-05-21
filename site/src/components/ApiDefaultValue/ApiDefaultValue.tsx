import { useState } from 'react';
import { siteBem } from '../../utils';
import './ApiDefaultValue.scss';

interface ApiDefaultValueProps {
  value?: string;
}

export function ApiDefaultValue({ value }: ApiDefaultValueProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const b = siteBem('api-default');

  if (!value) {
    return <span className={b({ empty: true })}>None</span>;
  }

  const isLongDefault = value.length > 48;

  if (!isLongDefault) {
    return <code className={b()}>{value}</code>;
  }

  return (
    <div className={b({ long: true, expanded: isExpanded })}>
      <button className={b('toggle')} type="button" onClick={() => setIsExpanded((current) => !current)}>
        {isExpanded ? 'Hide default' : 'Show default'}
      </button>
      {isExpanded ? <code className={b('value')}>{value}</code> : null}
    </div>
  );
}
