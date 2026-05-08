import { getPickerClassName } from '../../common/styleArchitecture';

export function ChromePointerCircle() {
  return <div className={getPickerClassName({ block: 'chrome', slot: 'pointer-circle' })} />;
}
