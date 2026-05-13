import { getPickerClassName } from '@/components/common/styleArchitecture';

export function SliderPointer() {
  return <div className={getPickerClassName({ block: 'slider', slot: 'pointer' })} />;
}
