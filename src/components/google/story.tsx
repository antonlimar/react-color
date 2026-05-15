import { renderPickerStory } from '@storybook-utils/renderPickerStory';
import { Google } from './Google';

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
