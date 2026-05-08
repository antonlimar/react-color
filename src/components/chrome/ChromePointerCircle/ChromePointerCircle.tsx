import { getPickerClassName } from '@/components/common/styleArchitecture';

export function ChromePointerCircle() {
  return <div className={getPickerClassName({ block: 'chrome', slot: 'pointer-circle' })} />;
}
