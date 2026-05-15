import './ChromePointer.scss';
import { bem } from '@/components/common';

const b = bem('chrome');

export function ChromePointer() {
  return <div className={b('pointer').toString()} />;
}
