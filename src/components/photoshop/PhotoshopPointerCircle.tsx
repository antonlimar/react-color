import type { HSLAColor } from '../../types';
import { getPickerClassName } from '../common/styleArchitecture';

type PhotoshopPointerCircleProps = {
  hsl: HSLAColor;
};

export const PhotoshopPointerCircle = ({ hsl }: PhotoshopPointerCircleProps) => {
  return (
    <div
      className={getPickerClassName({
        block: 'photoshop',
        slot: 'pointer-circle',
        modifiers: [hsl.l > 0.5 && 'black-outline'],
      })}
    />
  );
};

export default PhotoshopPointerCircle;
