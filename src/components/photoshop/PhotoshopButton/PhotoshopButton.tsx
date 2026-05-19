import type { KeyboardEvent, ReactNode } from 'react';
import { bem } from '@/components/common';

interface PhotoshopButtonProps {
  onClick?: () => void;
  label?: string;
  children?: ReactNode;
  active?: boolean;
}

const b = bem('photoshop');

const ENTER = 13;
const SPACE = 32;

export function PhotoshopButton({ onClick, label, children, active }: PhotoshopButtonProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      event.key === 'Enter' ||
      event.key === ' ' ||
      event.key === 'Spacebar' ||
      event.keyCode === ENTER ||
      event.keyCode === SPACE
    ) {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <div className={b('button', { active })} role="button" tabIndex={0} onClick={onClick} onKeyDown={handleKeyDown}>
      {label || children}
    </div>
  );
}
