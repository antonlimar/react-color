import React from 'react'
import reactCSS from 'reactcss'
import merge from 'lodash/merge'

import { ColorWrap, Hue } from '../common'
import SliderSwatches from './SliderSwatches'
import SliderPointer from './SliderPointer'
import type { ClassName, ColorPickerInjectedProps, HueProps, PickerCustomStyles } from '../../types'

type SliderProps = ColorPickerInjectedProps & {
  pointer?: HueProps['pointer']
  styles?: PickerCustomStyles
  className?: ClassName
}

export const Slider = ({
  hsl,
  onChange,
  pointer,
  styles: passedStyles = {},
  className = '',
}: SliderProps) => {
  const styles = reactCSS(merge({
    default: {
      hue: {
        height: '12px',
        position: 'relative',
      },
      Hue: {
        radius: '2px',
      },
    },
  }, passedStyles))

  return (
    <div style={ styles.wrap || {} } className={ `slider-picker ${className}` }>
      <div style={ styles.hue }>
        <Hue
          style={ styles.Hue }
          hsl={ hsl }
          pointer={ pointer }
          onChange={ onChange }
        />
      </div>
      <div style={ styles.swatches }>
        <SliderSwatches hsl={ hsl } onClick={ onChange } />
      </div>
    </div>
  )
}

Slider.defaultProps = {
  pointer: SliderPointer,
  styles: {},
}

export default ColorWrap(Slider)
