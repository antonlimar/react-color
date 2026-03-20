import React from 'react'

import Twitter from './Twitter'
import { renderPickerStory } from '../../../.storybook/renderPickerStory'

export default {
  title: 'Pickers',
  component: Twitter,
  render: renderPickerStory(Twitter),
  argTypes: {
    width: {
      control: { type: 'range', min: 140, max: 500, step: 1 },
    },
    triangle: {
      control: 'inline-radio',
      options: ['hide', 'top-left', 'top-right'],
    },
    colors: {
      control: 'object',
    },
    styles: {
      control: 'object',
    },
  },
}

export const TwitterPicker = {
  args: {
    width: 276,
    triangle: 'top-left',
    colors: ['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3',
      '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF'],
    styles: {},
  },
}
