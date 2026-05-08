import { cloneElement, isValidElement } from 'react';
import type { CSSProperties, ReactElement } from 'react';
import * as checkboard from '../../../helpers/checkboard';
import type { CheckboardProps } from '../../../types';
import { getPickerClassName } from '../styleArchitecture';

export const Checkboard = ({
  white = 'transparent',
  grey = 'rgba(0,0,0,.08)',
  size = 8,
  renderers = {},
  borderRadius,
  boxShadow,
  children,
}: CheckboardProps) => {
  const style: CSSProperties = {
    borderRadius,
    boxShadow,
    background: `url(${checkboard.get(white!, grey!, size!, renderers?.canvas)}) center left`,
  };
  const className = getPickerClassName({ block: 'checkboard' });

  if (isValidElement(children)) {
    const child = children as ReactElement<{ className?: string; style?: CSSProperties }>;

    return cloneElement(child, {
      ...child.props,
      className: [child.props.className, className].filter(Boolean).join(' ') || undefined,
      style: { ...child.props.style, ...style },
    });
  }

  return <div className={className} style={style} />;
};
