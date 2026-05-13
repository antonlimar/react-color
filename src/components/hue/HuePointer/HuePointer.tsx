import type { HueProps } from '@/types';
import { getPickerClassName } from '@/components/common/styleArchitecture';

type HuePointerProps = Pick<HueProps, 'direction'>;

export function HuePointer({ direction }: HuePointerProps) {
  return (
    <div
      className={getPickerClassName({
        block: 'hue',
        slot: 'pointer',
        modifiers: [direction === 'vertical' && 'vertical'],
      })}
    />
  );
}
