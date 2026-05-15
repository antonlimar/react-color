import { bem } from '@/components/common';
import './ChromePointerCircle.scss';

const b = bem('chrome');

export function ChromePointerCircle() {
  return <div className={b('pointer-circle')} />;
}
