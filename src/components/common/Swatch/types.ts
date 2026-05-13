import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';
import type { PickerStyle } from '@/types';

export interface SwatchProps {
  color: string;
  style?: PickerStyle;
  onClick?: (color: string, event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => void;
  onHover?: (color: string, event: MouseEvent<HTMLDivElement>) => void;
  title?: string;
  children?: ReactNode;
  focus?: boolean;
  focusStyle?: PickerStyle;
}
