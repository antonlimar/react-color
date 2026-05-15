import { Fragment } from 'react';

interface InlineContentProps {
  text: string;
}

export function InlineContent({ text }: InlineContentProps) {
  const segments = text.split(/(`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)\s]+\))/g);

  if (segments.length === 1) {
    return text;
  }

  return segments.map((segment, index) => {
    if (segment.startsWith('`') && segment.endsWith('`') && segment.length >= 2) {
      return <code key={`inline-code-${index}`}>{segment.slice(1, -1)}</code>;
    }

    const linkMatch = segment.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);

    if (linkMatch) {
      const [, label, href] = linkMatch;

      return (
        <a href={href} key={`inline-link-${index}`} rel="noreferrer" target="_blank">
          {label}
        </a>
      );
    }

    return <Fragment key={`inline-text-${index}`}>{segment}</Fragment>;
  });
}
