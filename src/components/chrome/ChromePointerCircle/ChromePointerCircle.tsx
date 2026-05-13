import { bem } from '@/components/common/styleArchitecture';

const b = bem('chrome');

export function ChromePointerCircle() {
  return <div className={b('pointer-circle').toString()} />;
}
