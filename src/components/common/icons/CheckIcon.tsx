import type { CSSProperties, SVGProps } from 'react';

const defaultStyle = {
  fill: 'currentcolor',
  width: '24px',
  height: '24px',
} satisfies CSSProperties;

export function CheckIcon({ style, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" style={{ ...defaultStyle, ...style }} {...props}>
      <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
    </svg>
  );
}
