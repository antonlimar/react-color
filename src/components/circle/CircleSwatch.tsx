import React from 'react'
import reactCSS, { handleHover } from 'reactcss'

import { Swatch } from '../common'
import type { SwatchHoverHandler } from '../../types'

type CircleSwatchProps = {
  color: string
  onClick: (color: string, event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void
  onSwatchHover?: SwatchHoverHandler
  hover?: boolean
  active?: boolean
  circleSize?: number
  circleSpacing?: number
}

export const CircleSwatch = ({
  color,
  onClick,
  onSwatchHover,
  hover,
  active,
  circleSize,
  circleSpacing,
}: CircleSwatchProps) => {
  const styles = reactCSS({
    default: {
      swatch: {
        width: circleSize,
        height: circleSize,
        marginRight: circleSpacing,
        marginBottom: circleSpacing,
        transform: 'scale(1)',
        transition: '100ms transform ease',
      },
      Swatch: {
        borderRadius: '50%',
        background: 'transparent',
        boxShadow: `inset 0 0 0 ${(circleSize! / 2) + 1}px ${color}`,
        transition: '100ms box-shadow ease',
      },
    },
    hover: {
      swatch: {
        transform: 'scale(1.2)',
      },
    },
    active: {
      Swatch: {
        boxShadow: `inset 0 0 0 3px ${color}`,
      },
    },
  }, { hover, active })
  const circleStyle = styles.Swatch || {}

  return (
    <div style={ styles.swatch }>
      <Swatch
        style={ circleStyle }
        color={ color }
        onClick={ onClick }
        onHover={ onSwatchHover as never }
        focusStyle={{ boxShadow: `${circleStyle.boxShadow || 'none'}, 0 0 5px ${color}` }}
      />
    </div>
  )
}

CircleSwatch.defaultProps = {
  circleSize: 28,
  circleSpacing: 14,
}

export default handleHover(CircleSwatch)
