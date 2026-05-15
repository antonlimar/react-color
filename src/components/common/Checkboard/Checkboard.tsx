import { cloneElement, isValidElement } from 'react';
import type { CSSProperties, ReactElement } from 'react';
import { getCheckboard } from '@/helpers';
import type { CheckboardProps } from './types';
import { bem } from '@/components/common';
import './Checkboard.scss';

const b = bem('checkboard');

export function Checkboard({
  white = 'transparent',
  grey = 'rgba(0,0,0,.08)',
  size = 8,
  renderers = {},
  borderRadius,
  boxShadow,
  children,
}: CheckboardProps) {
  const style: CSSProperties = {
    borderRadius,
    boxShadow,
    background: `url(${getCheckboard(white!, grey!, size!, renderers?.canvas)}) center left`,
  };
  const className = b().toString();

  if (isValidElement(children)) {
    const child = children as ReactElement<{ className?: string; style?: CSSProperties }>;

    return cloneElement(child, {
      ...child.props,
      className: [child.props.className, className].filter(Boolean).join(' ') || undefined,
      style: { ...child.props.style, ...style },
    });
  }

  return <div className={className} style={style} />;
}
