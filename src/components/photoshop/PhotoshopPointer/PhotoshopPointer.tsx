import { bem } from '@/components/common/styleArchitecture';

const b = bem('photoshop');

export function PhotoshopPointer() {
  return (
    <div className={b('pointer').toString()}>
      <div className={b('pointer-side', { left: true }).toString()}>
        <div className={b('pointer-fill').toString()} />
      </div>
      <div className={b('pointer-side', { right: true }).toString()}>
        <div className={b('pointer-fill').toString()} />
      </div>
    </div>
  );
}
