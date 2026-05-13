import type { ReactNode } from 'react';
import { getPickerClassName } from '@/components/common/styleArchitecture';

type PhotoshopButtonProps = {
  onClick?: () => void;
  label?: string;
  children?: ReactNode;
  active?: boolean;
};

export function PhotoshopButton({ onClick, label, children, active }: PhotoshopButtonProps) {
  return (
    <div
      className={getPickerClassName({ block: 'photoshop', slot: 'button', modifiers: [active && 'active'] })}
      onClick={onClick}
    >
      {label || children}
    </div>
  );
}
