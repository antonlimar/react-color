import { getPickerClassName } from '@/components/common/styleArchitecture';

export function PhotoshopPointer() {
  return (
    <div className={getPickerClassName({ block: 'photoshop', slot: 'pointer' })}>
      <div className={getPickerClassName({ block: 'photoshop', slot: 'pointer-side', modifiers: ['left'] })}>
        <div className={getPickerClassName({ block: 'photoshop', slot: 'pointer-fill' })} />
      </div>
      <div className={getPickerClassName({ block: 'photoshop', slot: 'pointer-side', modifiers: ['right'] })}>
        <div className={getPickerClassName({ block: 'photoshop', slot: 'pointer-fill' })} />
      </div>
    </div>
  );
}
