import type { AlphaProps } from '@/types';
import { getPickerClassName } from '@/components/common/styleArchitecture';

type AlphaPointerProps = Pick<AlphaProps, 'direction'>;

export function AlphaPointer({ direction }: AlphaPointerProps) {
  return (
    <div
      className={getPickerClassName({
        block: 'alpha',
        slot: 'pointer',
        modifiers: [direction === 'vertical' && 'vertical'],
      })}
    />
  );
}
