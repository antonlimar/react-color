import { getPickerClassName } from '../../common/styleArchitecture';

export const SliderPointer = () => {
  return <div className={getPickerClassName({ block: 'slider', slot: 'pointer' })} />;
};
