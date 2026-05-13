import { bem } from '@/components/common/styleArchitecture';
import './ChromePointer.scss';

const b = bem('chrome');

export function ChromePointer() {
  return <div className={b('pointer').toString()} />;
}
