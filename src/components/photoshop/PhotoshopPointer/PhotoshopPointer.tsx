import { getPickerClassName } from '../../common/styleArchitecture';

export const PhotoshopPointer = () => {
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
};
