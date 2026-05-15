import { bem } from '@/components/common';
import './ChromePointer.scss';

const b = bem('chrome');

export function ChromePointer() {
  return <div className={b('pointer')} />;
}
