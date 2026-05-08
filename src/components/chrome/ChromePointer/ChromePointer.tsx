import { getPickerClassName } from '../../common/styleArchitecture';

export function ChromePointer() {
  return <div className={getPickerClassName({ block: 'chrome', slot: 'pointer' })} />;
}
