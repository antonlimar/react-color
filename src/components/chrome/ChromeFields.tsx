import React from 'react'
import reactCSS from 'reactcss'
import * as color from '../../helpers/color'
import isUndefined from 'lodash/isUndefined'

import { EditableInput } from '../common'
import UnfoldMoreHorizontalIcon from '@icons/material/UnfoldMoreHorizontalIcon'
import type {
  ColorChangeValue,
  ColorPickerChangeEvent,
  HSLAColor,
  RGBAColor,
} from '../../types'

type ChromeFieldsProps = {
  hsl: HSLAColor
  rgb: RGBAColor
  hex: string
  view?: 'hex' | 'rgb' | 'hsl'
  disableAlpha?: boolean
  onChange: (data: ColorChangeValue, event?: ColorPickerChangeEvent) => void
}

type ChromeFieldsState = {
  view: 'hex' | 'rgb' | 'hsl'
}

export class ChromeFields extends React.Component<ChromeFieldsProps, ChromeFieldsState> {
  constructor(props: ChromeFieldsProps) {
    super(props)

    this.state = {
      view: props.hsl.a !== 1 && props.view === 'hex' ? 'rgb' : (props.view || 'hex'),
    }
  }

  static getDerivedStateFromProps(nextProps: ChromeFieldsProps, state: ChromeFieldsState) {
    if (nextProps.hsl.a !== 1 && state.view === 'hex') {
      return { view: 'rgb' as const }
    }
    return null
  }

  toggleViews = () => {
    if (this.state.view === 'hex') {
      this.setState({ view: 'rgb' })
    } else if (this.state.view === 'rgb') {
      this.setState({ view: 'hsl' })
    } else if (this.props.hsl.a === 1) {
      this.setState({ view: 'hex' })
    } else {
      this.setState({ view: 'rgb' })
    }
  }

  handleChange = (data: ColorChangeValue, event?: ColorPickerChangeEvent) => {
    if (data.hex) {
      if (color.isValidHex(data.hex)) {
        this.props.onChange({
          hex: data.hex,
          source: 'hex',
        }, event)
      }
    } else if (data.r || data.g || data.b) {
      this.props.onChange({
        r: data.r || this.props.rgb.r,
        g: data.g || this.props.rgb.g,
        b: data.b || this.props.rgb.b,
        source: 'rgb',
      }, event)
    } else if (!isUndefined(data.a)) {
      let alpha = Number(data.a)
      if (alpha < 0) {
        alpha = 0
      } else if (alpha > 1) {
        alpha = 1
      }

      this.props.onChange({
        h: this.props.hsl.h,
        s: this.props.hsl.s,
        l: this.props.hsl.l,
        a: Math.round(alpha * 100) / 100,
        source: 'rgb',
      }, event)
    } else if (!isUndefined(data.h) || !isUndefined(data.s) || !isUndefined(data.l)) {
      const saturation = typeof data.s === 'string' && data.s.indexOf('%') > -1 ? data.s.replace('%', '') : data.s
      const lightness = typeof data.l === 'string' && data.l.indexOf('%') > -1 ? data.l.replace('%', '') : data.l

      let nextSaturation = Number(!isUndefined(saturation) ? saturation : this.props.hsl.s)
      let nextLightness = Number(!isUndefined(lightness) ? lightness : this.props.hsl.l)

      if (nextSaturation === 1) {
        nextSaturation = 0.01
      } else if (nextLightness === 1) {
        nextLightness = 0.01
      }

      this.props.onChange({
        h: Number(!isUndefined(data.h) ? data.h : this.props.hsl.h),
        s: nextSaturation,
        l: nextLightness,
        source: 'hsl',
      }, event)
    }
  }

  showHighlight = (event: React.MouseEvent<HTMLDivElement>) => {
    event.currentTarget.style.background = '#eee'
  }

  hideHighlight = (event: React.MouseEvent<HTMLDivElement>) => {
    event.currentTarget.style.background = 'transparent'
  }

  render() {
    const styles = reactCSS({
      default: {
        wrap: {
          paddingTop: '16px',
          display: 'flex',
        },
        fields: {
          flex: '1',
          display: 'flex',
          marginLeft: '-6px',
        },
        field: {
          paddingLeft: '6px',
          width: '100%',
        },
        alpha: {
          paddingLeft: '6px',
          width: '100%',
        },
        toggle: {
          width: '32px',
          textAlign: 'right',
          position: 'relative',
        },
        icon: {
          marginRight: '-4px',
          marginTop: '12px',
          cursor: 'pointer',
          position: 'relative',
        },
        iconHighlight: {
          position: 'absolute',
          width: '24px',
          height: '28px',
          background: '#eee',
          borderRadius: '4px',
          top: '10px',
          left: '12px',
          display: 'none',
        },
        input: {
          fontSize: '11px',
          color: '#333',
          width: '100%',
          borderRadius: '2px',
          border: 'none',
          boxShadow: 'inset 0 0 0 1px #dadada',
          height: '21px',
          textAlign: 'center',
        },
        label: {
          textTransform: 'uppercase',
          fontSize: '11px',
          lineHeight: '11px',
          color: '#969696',
          textAlign: 'center',
          display: 'block',
          marginTop: '12px',
        },
        svg: {
          fill: '#333',
          width: '24px',
          height: '24px',
          border: '1px transparent solid',
          borderRadius: '5px',
        },
      },
      disableAlpha: {
        alpha: {
          display: 'none',
        },
      },
    }, this.props, this.state)

    let fields: React.ReactNode
    if (this.state.view === 'hex') {
      fields = (
        <div style={ styles.fields } className="flexbox-fix">
          <div style={ styles.field }>
            <EditableInput
              style={{ input: styles.input, label: styles.label }}
              label="hex"
              value={ this.props.hex }
              onChange={ (value, event) => this.handleChange(value as ColorChangeValue, event) }
            />
          </div>
        </div>
      )
    } else if (this.state.view === 'rgb') {
      fields = (
        <div style={ styles.fields } className="flexbox-fix">
          <div style={ styles.field }>
            <EditableInput style={{ input: styles.input, label: styles.label }} label="r" value={ this.props.rgb.r } onChange={ (value, event) => this.handleChange(value as ColorChangeValue, event) } />
          </div>
          <div style={ styles.field }>
            <EditableInput style={{ input: styles.input, label: styles.label }} label="g" value={ this.props.rgb.g } onChange={ (value, event) => this.handleChange(value as ColorChangeValue, event) } />
          </div>
          <div style={ styles.field }>
            <EditableInput style={{ input: styles.input, label: styles.label }} label="b" value={ this.props.rgb.b } onChange={ (value, event) => this.handleChange(value as ColorChangeValue, event) } />
          </div>
          <div style={ styles.alpha }>
            <EditableInput style={{ input: styles.input, label: styles.label }} label="a" value={ this.props.rgb.a } arrowOffset={ 0.01 } onChange={ (value, event) => this.handleChange(value as ColorChangeValue, event) } />
          </div>
        </div>
      )
    } else {
      fields = (
        <div style={ styles.fields } className="flexbox-fix">
          <div style={ styles.field }>
            <EditableInput style={{ input: styles.input, label: styles.label }} label="h" value={ Math.round(this.props.hsl.h) } onChange={ (value, event) => this.handleChange(value as ColorChangeValue, event) } />
          </div>
          <div style={ styles.field }>
            <EditableInput style={{ input: styles.input, label: styles.label }} label="s" value={ `${Math.round(this.props.hsl.s * 100)}%` } onChange={ (value, event) => this.handleChange(value as ColorChangeValue, event) } />
          </div>
          <div style={ styles.field }>
            <EditableInput style={{ input: styles.input, label: styles.label }} label="l" value={ `${Math.round(this.props.hsl.l * 100)}%` } onChange={ (value, event) => this.handleChange(value as ColorChangeValue, event) } />
          </div>
          <div style={ styles.alpha }>
            <EditableInput style={{ input: styles.input, label: styles.label }} label="a" value={ this.props.hsl.a } arrowOffset={ 0.01 } onChange={ (value, event) => this.handleChange(value as ColorChangeValue, event) } />
          </div>
        </div>
      )
    }

    return (
      <div style={ styles.wrap } className="flexbox-fix">
        { fields }
        <div style={ styles.toggle }>
          <div
            style={ styles.icon }
            onClick={ this.toggleViews }
            onMouseOver={ this.showHighlight }
            onMouseEnter={ this.showHighlight }
            onMouseOut={ this.hideHighlight }
          >
            <UnfoldMoreHorizontalIcon style={ styles.svg } />
          </div>
        </div>
      </div>
    )
  }
}

export default ChromeFields
