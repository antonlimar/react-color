import type { AlphaProps } from '../../types';
import { getPickerClassName } from '../common/styleArchitecture';

type AlphaPointerProps = Pick<AlphaProps, 'direction'>;

export const AlphaPointer = ({ direction }: AlphaPointerProps) => {
  return (
    <div
      className={getPickerClassName({
        block: 'alpha',
        slot: 'pointer',
        modifiers: [direction === 'vertical' && 'vertical'],
      })}
    />
  );
};

export default AlphaPointer;
