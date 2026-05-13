import type { AlphaProps } from '@/components/common/Alpha';
import { bem } from '@/components/common/styleArchitecture';
import './AlphaPointer.scss';

const b = bem('alpha');

type AlphaPointerProps = Pick<AlphaProps, 'direction'>;

export function AlphaPointer({ direction }: AlphaPointerProps) {
  return <div className={b('pointer', { vertical: direction === 'vertical' }).toString()} />;
}
