import { getPickerClassName } from '../common/styleArchitecture';

export const ChromePointer = () => {
  return <div className={getPickerClassName({ block: 'chrome', slot: 'pointer' })} />;
};

export default ChromePointer;
