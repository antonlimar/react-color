import type { ReactNode } from 'react';
import { getPickerClassName } from '../../common/styleArchitecture';

type PhotoshopButtonProps = {
  onClick?: () => void;
  label?: string;
  children?: ReactNode;
  active?: boolean;
};

export const PhotoshopButton = ({ onClick, label, children, active }: PhotoshopButtonProps) => {
  return (
    <div
      className={getPickerClassName({ block: 'photoshop', slot: 'button', modifiers: [active && 'active'] })}
      onClick={onClick}
    >
      {label || children}
    </div>
  );
};
