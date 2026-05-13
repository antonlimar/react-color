import { bem } from '@/components/common/styleArchitecture';

const b = bem('chrome');

export function ChromePointer() {
  return <div className={b('pointer').toString()} />;
}
