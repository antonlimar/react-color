import { renderPickerStory } from '@storybook-utils/renderPickerStory';
import { Chrome } from './Chrome';

export default {
  title: 'Pickers/Chrome Picker',
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
  name: 'Light Theme',
  args: {
    width: 225,
    disableAlpha: false,
    theme: 'light',
    styles: {},
  },
};

export const ChromePickerDark = {
  name: 'Dark Theme',
  args: {
    ...ChromePicker.args,
    theme: 'dark',
  },
};
