import React from 'react'
import reactCSS from 'reactcss'
import map from 'lodash/map'

import SwatchesColor from './SwatchesColor'
import type { SwatchHoverHandler } from '../../types'

type SwatchesGroupProps = {
  onClick: (color: string, event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void
  onSwatchHover?: SwatchHoverHandler
  group: string[]
  active: string
}

export const SwatchesGroup = ({ onClick, onSwatchHover, group, active }: SwatchesGroupProps) => {
  const styles = reactCSS({
    default: {
      group: {
        paddingBottom: '10px',
        width: '40px',
        float: 'left',
        marginRight: '10px',
      },
    },
  })

  return (
    <div style={ styles.group }>
      { map(group, (colorValue, index) => (
        <SwatchesColor
          key={ colorValue }
          color={ colorValue }
          active={ colorValue.toLowerCase() === active }
          first={ index === 0 }
          last={ index === group.length - 1 }
          onClick={ onClick }
          onSwatchHover={ onSwatchHover }
        />
      )) }
    </div>
  )
}

export default SwatchesGroup
