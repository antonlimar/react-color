import type { ReactNode } from 'react';
import type { PickerCustomStyles, PickerStyle, PickerTheme } from '@/types';

export interface RaisedProps {
  background?: string;
  zDepth?: 0 | 1 | 2 | 3 | 4 | 5;
  radius?: number;
  style?: PickerStyle;
  styles?: PickerCustomStyles;
  theme?: PickerTheme;
  children?: ReactNode;
}
