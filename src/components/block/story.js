import React from 'react'

import Block from './Block'
import { renderPickerStory } from '../../../.storybook/renderPickerStory'

export default {
  title: 'Pickers',
  component: Block,
  render: renderPickerStory(Block),
  argTypes: {
    width: {
      control: { type: 'range', min: 140, max: 500, step: 1 },
    },
    triangle: {
      control: 'inline-radio',
      options: ['top', 'hide'],
    },
    colors: {
      control: 'object',
    },
    styles: {
      control: 'object',
    },
  },
}

export const BlockPicker = {
  args: {
    width: 170,
    triangle: 'top',
    colors: ['#D9E3F0', '#F47373', '#697689', '#37D67A', '#2CCCE4', '#555555',
      '#dce775', '#ff8a65', '#ba68c8'],
    styles: {},
  },
}
