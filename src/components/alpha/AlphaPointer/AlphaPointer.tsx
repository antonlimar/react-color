import type { AlphaProps } from '@/types';
import { bem } from '@/components/common/styleArchitecture';

const b = bem('alpha');

type AlphaPointerProps = Pick<AlphaProps, 'direction'>;

export function AlphaPointer({ direction }: AlphaPointerProps) {
  return <div className={b('pointer', { vertical: direction === 'vertical' }).toString()} />;
}
