import { bem } from '@/components/common/styleArchitecture';

const b = bem('slider');

export function SliderPointer() {
  return <div className={b('pointer').toString()} />;
}
