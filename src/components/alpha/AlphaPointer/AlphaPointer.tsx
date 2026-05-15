import { bem } from '@/components/common';
import type { AlphaProps } from '@/components/common';
import './AlphaPointer.scss';

const b = bem('alpha');

type AlphaPointerProps = Pick<AlphaProps, 'direction'>;

export function AlphaPointer({ direction }: AlphaPointerProps) {
  return <div className={b('pointer', { vertical: direction === 'vertical' }).toString()} />;
}
