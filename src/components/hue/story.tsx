import { renderPickerStory } from '@storybook-utils/renderPickerStory';
import { Hue } from './Hue';

export default {
  title: 'Pickers/Hue Picker',
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
  name: 'Light Theme',
  args: {
    width: 316,
    height: 16,
    direction: 'horizontal',
    theme: 'light',
    styles: {},
  },
};

export const HuePickerDark = {
  name: 'Dark Theme',
  args: {
    ...HuePicker.args,
    theme: 'dark',
  },
};
