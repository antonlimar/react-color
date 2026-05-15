import type { ReactNode } from 'react';
import { bem } from '@/components/common';

type PhotoshopButtonProps = {
  onClick?: () => void;
  label?: string;
  children?: ReactNode;
  active?: boolean;
};

const b = bem('photoshop');

export function PhotoshopButton({ onClick, label, children, active }: PhotoshopButtonProps) {
  return (
    <div className={b('button', { active })} onClick={onClick}>
      {label || children}
    </div>
  );
}
