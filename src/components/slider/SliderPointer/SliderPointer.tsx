import { getPickerClassName } from '@/components/common/styleArchitecture';

export const SliderPointer = () => {
  return <div className={getPickerClassName({ block: 'slider', slot: 'pointer' })} />;
};
