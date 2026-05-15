import './SliderPointer.scss';
import { bem } from '@/components/common';

const b = bem('slider');

export function SliderPointer() {
  return <div className={b('pointer').toString()} />;
}
