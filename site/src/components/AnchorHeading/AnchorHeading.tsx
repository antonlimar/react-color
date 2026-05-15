import { useCallback } from 'react';
import type { ReactNode } from 'react';

export type AnchorHeadingLevel = 2 | 3 | 4;

interface AnchorHeadingProps {
  anchorId: string;
  children: ReactNode;
  level: AnchorHeadingLevel;
}

export function AnchorHeading({ anchorId, children, level }: AnchorHeadingProps) {
  const Heading = `h${level}` as const;
  const anchor = `#${anchorId}`;

  const copyAnchor = useCallback(() => {
    void navigator.clipboard?.writeText(anchor);
  }, [anchor]);

  return (
    <Heading className="anchor-heading">
      <a className="anchor-heading__link" href={anchor} onClick={copyAnchor} title={`Copy ${anchor} anchor`}>
        <span className="anchor-heading__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M10.6 13.4a1 1 0 0 1 0-1.4l2.6-2.6a1 1 0 0 1 1.4 1.4L12 13.4a1 1 0 0 1-1.4 0Z" />
            <path d="M8.1 17.3a4.2 4.2 0 0 1-5.9-5.9l3.4-3.4a4.2 4.2 0 0 1 5.9 0 1 1 0 1 1-1.4 1.4 2.2 2.2 0 0 0-3.1 0l-3.4 3.4a2.2 2.2 0 0 0 3.1 3.1l1.2-1.2a1 1 0 1 1 1.4 1.4l-1.2 1.2Z" />
            <path d="M12.5 16a1 1 0 0 1 0-1.4 2.2 2.2 0 0 0 3.1 0l3.4-3.4a2.2 2.2 0 0 0-3.1-3.1l-1.2 1.2a1 1 0 1 1-1.4-1.4l1.2-1.2a4.2 4.2 0 0 1 5.9 5.9L17 16a4.2 4.2 0 0 1-5.9 0 1 1 0 0 1 1.4 0Z" />
          </svg>
        </span>
        <span>{children}</span>
      </a>
    </Heading>
  );
}
