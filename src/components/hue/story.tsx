import { Hue } from './Hue';
import { renderPickerStory } from '../../../.storybook/renderPickerStory';

export default {
  title: 'Pickers',
  component: Hue,
  render: renderPickerStory(Hue),
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
    styles: {
      control: 'object',
    },
  },
};

export const HuePicker = {
  args: {
    width: 316,
    height: 16,
    direction: 'horizontal',
    styles: {},
  },
};
