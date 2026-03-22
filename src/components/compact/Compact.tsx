import React from 'react'
import reactCSS from 'reactcss'
import map from 'lodash/map'
import merge from 'lodash/merge'
import * as color from '../../helpers/color'

import { ColorWrap, Raised } from '../common'
import CompactColor from './CompactColor'
import CompactFields from './CompactFields'
import type {
  ClassName,
  ColorChangeValue,
  ColorPickerChangeEvent,
  ColorPickerInjectedProps,
  PickerCustomStyles,
} from '../../types'

type CompactProps = ColorPickerInjectedProps & {
  colors?: string[]
  styles?: PickerCustomStyles
  className?: ClassName
}

const handleCompactChange = (
  onChange: CompactProps['onChange'],
  data: ColorChangeValue,
  event?: ColorPickerChangeEvent,
) => {
  if (data.hex) {
    if (color.isValidHex(data.hex)) {
      onChange({
        hex: data.hex,
        source: 'hex',
      }, event)
    }
  } else {
    onChange(data, event)
  }
}

export const Compact = ({
  onChange,
  onSwatchHover,
  colors,
  hex,
  rgb,
  styles: passedStyles = {},
  className = '',
}: CompactProps) => {
  const styles = reactCSS(merge({
    default: {
      Compact: {
        background: '#f6f6f6',
        radius: '4px',
      },
      compact: {
        paddingTop: '5px',
        paddingLeft: '5px',
        boxSizing: 'initial',
        width: '240px',
      },
      clear: {
        clear: 'both',
      },
    },
  }, passedStyles))

  return (
    <Raised style={ styles.Compact } styles={ passedStyles }>
      <div style={ styles.compact } className={ `compact-picker ${className}` }>
        <div>
          { map(colors, (colorValue: string) => (
            <CompactColor
              key={ colorValue }
              color={ colorValue }
              active={ colorValue.toLowerCase() === hex }
              onClick={ (swatchColor, event) => handleCompactChange(onChange, { hex: swatchColor }, event) }
              onSwatchHover={ onSwatchHover }
            />
          )) }
          <div style={ styles.clear } />
        </div>
        <CompactFields
          hex={ hex }
          rgb={ rgb }
          onChange={ (data, event) => handleCompactChange(onChange, data, event) }
        />
      </div>
    </Raised>
  )
}

Compact.defaultProps = {
  colors: ['#4D4D4D', '#999999', '#FFFFFF', '#F44E3B', '#FE9200', '#FCDC00',
    '#DBDF00', '#A4DD00', '#68CCCA', '#73D8FF', '#AEA1FF', '#FDA1FF',
    '#333333', '#808080', '#cccccc', '#D33115', '#E27300', '#FCC400',
    '#B0BC00', '#68BC00', '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF',
    '#000000', '#666666', '#B3B3B3', '#9F0500', '#C45100', '#FB9E00',
    '#808900', '#194D33', '#0C797D', '#0062B1', '#653294', '#AB149E',
  ],
  styles: {},
}

export default ColorWrap(Compact)
