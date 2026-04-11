import { getPickerClassName } from '../common/styleArchitecture';

export const ChromePointerCircle = () => {
  return <div className={getPickerClassName({ block: 'chrome', slot: 'pointer-circle' })} />;
};

export default ChromePointerCircle;
