import './AlphaPointer.scss';
import { bem } from '@/components/common';
import type { AlphaProps } from '@/components/common';

const b = bem('alpha');

type AlphaPointerProps = Pick<AlphaProps, 'direction'>;

export function AlphaPointer({ direction }: AlphaPointerProps) {
  return <div className={b('pointer', { vertical: direction === 'vertical' }).toString()} />;
}
