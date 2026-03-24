import reactCSS from 'reactcss';
import type { HueProps } from '../../types';

type HuePointerProps = Pick<HueProps, 'direction'>;

export const HuePointer = ({ direction }: HuePointerProps) => {
  const styles = reactCSS(
    {
      default: {
        picker: {
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          transform: 'translate(-9px, -1px)',
          backgroundColor: 'rgb(248, 248, 248)',
          boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.37)',
        },
      },
      vertical: {
        picker: {
          transform: 'translate(-3px, -9px)',
        },
      },
    },
    { vertical: direction === 'vertical' },
  );

  return <div style={styles.picker} />;
};

export default HuePointer;
