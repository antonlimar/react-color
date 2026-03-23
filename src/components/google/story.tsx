import React from 'react';

import Google from './Google';
import { renderPickerStory } from '../../../.storybook/renderPickerStory';

export default {
  title: 'Pickers',
  component: Google,
  render: renderPickerStory(Google),
  argTypes: {
    width: {
      control: 'number',
    },
    header: {
      control: 'text',
    },
    styles: {
      control: 'object',
    },
  },
};

export const GooglePicker = {
  args: {
    width: 652,
    header: 'Color picker',
    styles: {},
  },
};
