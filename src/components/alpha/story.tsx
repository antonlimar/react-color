import { renderPickerStory } from '@storybook-utils/renderPickerStory';
import { Alpha } from './Alpha';

export default {
  title: 'Pickers',
  component: Alpha,
  render: renderPickerStory(Alpha),
  argTypes: {
    width: {
      control: 'number',
    },
    height: {
      control: 'number',
    },
    direction: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    style: {
      control: 'object',
    },
  },
};

export const AlphaPicker = {
  args: {
    width: 316,
    height: 16,
    direction: 'horizontal',
    style: {},
  },
};
