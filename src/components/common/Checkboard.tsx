import React, { CSSProperties, ReactElement, isValidElement } from 'react';
import reactCSS from 'reactcss';
import * as checkboard from '../../helpers/checkboard';
import type { CheckboardProps } from '../../types';

export const Checkboard = ({ white, grey, size, renderers, borderRadius, boxShadow, children }: CheckboardProps) => {
  const styles = reactCSS({
    default: {
      grid: {
        borderRadius,
        boxShadow,
        absolute: '0px 0px 0px 0px',
        background: `url(${checkboard.get(white!, grey!, size!, renderers?.canvas)}) center left`,
      },
    },
  });

  if (isValidElement(children)) {
    const child = children as ReactElement<{ style?: CSSProperties }>;

    return React.cloneElement(child, {
      ...child.props,
      style: { ...child.props.style, ...styles.grid },
    });
  }

  return <div style={styles.grid} />;
};

Checkboard.defaultProps = {
  size: 8,
  white: 'transparent',
  grey: 'rgba(0,0,0,.08)',
  renderers: {},
};

export default Checkboard;
