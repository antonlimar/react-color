import { getPickerClassName } from '@/components/common/styleArchitecture';

export function ChromePointer() {
  return <div className={getPickerClassName({ block: 'chrome', slot: 'pointer' })} />;
}
