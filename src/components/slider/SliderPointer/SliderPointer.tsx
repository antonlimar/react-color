import { bem } from '@/components/common';
import './SliderPointer.scss';

const b = bem('slider');

export function SliderPointer() {
  return <div className={b('pointer')} />;
}
