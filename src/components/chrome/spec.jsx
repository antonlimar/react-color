import React from 'react'
import * as color from '../../helpers/color'

import Chrome from './Chrome'
import ChromeFields from './ChromeFields'
import ChromePointer from './ChromePointer'
import ChromePointerCircle from './ChromePointerCircle'
import {
  changeInputByLabel,
  createColorChangeSpy,
  renderForSnapshot,
} from '../../../test/helpers'

test('Chrome renders correctly', () => {
  renderForSnapshot(<Chrome { ...color.red } />).expectSnapshot()
})

test('Chrome onChange events correctly', () => {
  const changeSpy = createColorChangeSpy(color)
  renderForSnapshot(<Chrome { ...color.red } onChange={ changeSpy } />)

  changeInputByLabel('hex', '#00ff00')
  expect(changeSpy).toHaveBeenCalled()
})

test('ChromeFields renders correctly', () => {
  renderForSnapshot(<ChromeFields { ...color.red } />).expectSnapshot()
})

test('ChromePointer renders correctly', () => {
  renderForSnapshot(<ChromePointer />).expectSnapshot()
})

test('ChromePointerCircle renders correctly', () => {
  renderForSnapshot(<ChromePointerCircle />).expectSnapshot()
})

test('Chrome renders custom styles correctly', () => {
  const { container } = renderForSnapshot(
    <Chrome styles={{ default: { picker: { boxShadow: 'none' } } }} />,
  )

  expect(container.firstChild.style.boxShadow).toBe('none')
})

test('Chrome renders correctly with width', () => {
  const { container } = renderForSnapshot(<Chrome width={ 300 } />)

  expect(container.firstChild.style.width).toBe('300px')
})
