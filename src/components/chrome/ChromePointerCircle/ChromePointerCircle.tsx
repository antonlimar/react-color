import './ChromePointerCircle.scss';
import { bem } from '@/components/common';

const b = bem('chrome');

export function ChromePointerCircle() {
  return <div className={b('pointer-circle').toString()} />;
}
