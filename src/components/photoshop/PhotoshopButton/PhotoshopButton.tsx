import type { ReactNode } from 'react';
import { bem } from '@/components/common/styleArchitecture';

const b = bem('photoshop');

type PhotoshopButtonProps = {
  onClick?: () => void;
  label?: string;
  children?: ReactNode;
  active?: boolean;
};

export function PhotoshopButton({ onClick, label, children, active }: PhotoshopButtonProps) {
  return (
    <div className={b('button', { active }).toString()} onClick={onClick}>
      {label || children}
    </div>
  );
}
