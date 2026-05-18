import { renderPickerStory } from '@storybook-utils/renderPickerStory';
import { Google } from './Google';

export default {
  title: 'Pickers/Google Picker',
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
  name: 'Light Theme',
  args: {
    width: 652,
    header: 'Color picker',
    theme: 'light',
    styles: {},
  },
};

export const GooglePickerDark = {
  name: 'Dark Theme',
  args: {
    ...GooglePicker.args,
    theme: 'dark',
  },
};
