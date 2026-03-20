import React, { KeyboardEvent, MouseEvent } from 'react'
import reactCSS from 'reactcss'
import { handleFocus } from '../../helpers/interaction'
import type { Radius, SwatchProps } from '../../types'
import Checkboard from './Checkboard'

const ENTER = 13

export const Swatch = ({
  color,
  style,
  onClick = () => {},
  onHover,
  title = color,
  children,
  focus,
  focusStyle = {},
}: SwatchProps) => {
  const transparent = color === 'transparent'
  const styles = reactCSS({
    default: {
      swatch: {
        background: color,
        height: '100%',
        width: '100%',
        cursor: 'pointer',
        position: 'relative',
        outline: 'none',
        ...style,
        ...(focus ? focusStyle : {}),
      },
    },
  })

  const handleClick = (event: MouseEvent<HTMLDivElement>) => onClick(color, event)
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => event.keyCode === ENTER && onClick(color, event)
  const handleHover = (event: MouseEvent<HTMLDivElement>) => onHover?.(color, event)

  const optionalEvents = onHover ? { onMouseOver: handleHover } : {}

  return (
    <div
      style={ styles.swatch }
      onClick={ handleClick }
      title={ title }
      tabIndex={ 0 }
      onKeyDown={ handleKeyDown }
      { ...optionalEvents }
    >
      { children }
      { transparent && (
        <Checkboard
          borderRadius={ styles.swatch.borderRadius as Radius }
          boxShadow="inset 0 0 0 1px rgba(0,0,0,0.1)"
        />
      ) }
    </div>
  )
}

export default handleFocus(Swatch)
