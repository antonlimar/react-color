import type { CSSProperties } from 'react';
import type { RaisedProps } from '../../types';
import { getPickerClassName } from './styleArchitecture';

const isStyleObject = (value: unknown): value is CSSProperties =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const getRaisedStyle = (styles: RaisedProps['styles'], slot: 'wrap' | 'bg' | 'content'): CSSProperties => {
  const defaultStyles =
    typeof styles?.default === 'object' && styles.default !== null
      ? (styles.default as Record<string, unknown>)
      : undefined;
  const slotStyle = defaultStyles?.[slot] ?? styles?.[slot];

  return isStyleObject(slotStyle) ? slotStyle : {};
};

export const Raised = ({
  zDepth = 1,
  radius = 2,
  background = '#fff',
  children,
  style,
  styles: passedStyles = {},
}: RaisedProps) => {
  const wrapStyle = getRaisedStyle(passedStyles, 'wrap');
  const contentStyle = getRaisedStyle(passedStyles, 'content');
  const bgStyle: CSSProperties = {
    boxShadow:
      zDepth === 0
        ? 'none'
        : zDepth === 1
          ? '0 2px 10px rgba(0,0,0,.12), 0 2px 5px rgba(0,0,0,.16)'
          : `0 ${zDepth}px ${zDepth * 4}px rgba(0,0,0,.24)`,
    borderRadius: radius,
    background,
    ...(style || {}),
    ...getRaisedStyle(passedStyles, 'bg'),
  };

  return (
    <div className={getPickerClassName({ block: 'raised' })} style={wrapStyle}>
      <div className={getPickerClassName({ block: 'raised', slot: 'bg' })} style={bgStyle} />
      <div className={getPickerClassName({ block: 'raised', slot: 'content' })} style={contentStyle}>
        {children}
      </div>
    </div>
  );
};

export default Raised;
