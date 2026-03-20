import React from 'react'
import * as color from '../../helpers/color'

import Swatches from './Swatches'
import SwatchesColor from './SwatchesColor'
import SwatchesGroup from './SwatchesGroup'
import {
  clickFirstSwatch,
  createColorChangeSpy,
  hoverFirstSwatch,
  renderForSnapshot,
} from '../../../test/helpers'

test('Swatches renders correctly', () => {
  renderForSnapshot(
    <Swatches hex={ color.red.hex } colors={ [['#fff'], ['#333']] } />,
  ).expectSnapshot()
})

test('Swatches renders custom styles correctly', () => {
  const { container } = renderForSnapshot(
    <Swatches hex={ color.red.hex } colors={ [['#fff'], ['#333']] } styles={{ default: { picker: { boxShadow: '0 0 10px red' } } }} />,
  )

  expect(container.firstChild.style.boxShadow).toBe('0 0 10px red')
})

test('Swatches onChange events correctly', () => {
  const changeSpy = createColorChangeSpy(color)
  const { container } = renderForSnapshot(<Swatches onChange={ changeSpy } />)

  clickFirstSwatch(container)
  expect(changeSpy).toHaveBeenCalled()
})

test('Swatches with onSwatchHover events correctly', () => {
  const hoverSpy = createColorChangeSpy(color)
  const { container } = renderForSnapshot(<Swatches onSwatchHover={ hoverSpy } />)

  hoverFirstSwatch(container)
  expect(hoverSpy).toHaveBeenCalled()
})

test('SwatchesColor renders correctly', () => {
  renderForSnapshot(<SwatchesColor />).expectSnapshot()
})

test('SwatchesColor renders with props', () => {
  renderForSnapshot(<SwatchesColor active first last />).expectSnapshot()
})

test('SwatchesGroup renders correctly', () => {
  renderForSnapshot(<SwatchesGroup active={ color.red.hex } group={ ['#fff'] } />).expectSnapshot()
})
