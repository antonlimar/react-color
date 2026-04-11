import type { HueProps } from '../../types';
import { getPickerClassName } from '../common/styleArchitecture';

type HuePointerProps = Pick<HueProps, 'direction'>;

export const HuePointer = ({ direction }: HuePointerProps) => {
  return (
    <div
      className={getPickerClassName({
        block: 'hue',
        slot: 'pointer',
        modifiers: [direction === 'vertical' && 'vertical'],
      })}
    />
  );
};

export default HuePointer;
