import React from 'react';

import Chrome from './Chrome';
import { renderPickerStory } from '../../../.storybook/renderPickerStory';

export default {
  title: 'Pickers',
  component: Chrome,
  render: renderPickerStory(Chrome),
  argTypes: {
    width: {
      control: 'number',
    },
    disableAlpha: {
      control: 'boolean',
    },
    defaultView: {
      control: 'inline-radio',
      options: ['hex', 'rgb', 'hsl'],
    },
    styles: {
      control: 'object',
    },
  },
};

export const ChromePicker = {
  args: {
    width: 225,
    disableAlpha: false,
    styles: {},
  },
};
