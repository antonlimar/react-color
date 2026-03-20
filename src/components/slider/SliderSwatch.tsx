import React from 'react'
import reactCSS from 'reactcss'
import type { ColorInputChangeHandler, HSLAColor } from '../../types'

type SliderSwatchProps = {
  hsl: HSLAColor
  offset: number
  onClick?: ColorInputChangeHandler
  active?: boolean
  first?: boolean
  last?: boolean
}

export const SliderSwatch = ({
  hsl,
  offset,
  onClick = () => {},
  active,
  first,
  last,
}: SliderSwatchProps) => {
  const styles = reactCSS({
    default: {
      swatch: {
        height: '12px',
        background: `hsl(${hsl.h}, 50%, ${offset * 100}%)`,
        cursor: 'pointer',
      },
    },
    first: {
      swatch: {
        borderRadius: '2px 0 0 2px',
      },
    },
    last: {
      swatch: {
        borderRadius: '0 2px 2px 0',
      },
    },
    active: {
      swatch: {
        transform: 'scaleY(1.8)',
        borderRadius: '3.6px/2px',
      },
    },
  }, { active, first, last })

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    onClick({
      h: hsl.h,
      s: 0.5,
      l: offset,
      source: 'hsl',
    }, event)
  }

  return <div style={ styles.swatch } onClick={ handleClick } />
}

export default SliderSwatch
