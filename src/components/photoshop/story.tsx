import { renderPickerStory } from '@storybook-utils/renderPickerStory';
import { Photoshop } from './Photoshop';

export default {
  title: 'Pickers/Photoshop Picker',
  component: Photoshop,
  render: renderPickerStory(Photoshop),
  argTypes: {
    header: {
      control: 'text',
    },
    styles: {
      control: 'object',
    },
  },
};

export const PhotoshopPicker = {
  name: 'Light Theme',
  args: {
    header: 'Color Picker',
    theme: 'light',
    styles: {},
  },
};

export const PhotoshopPickerDark = {
  name: 'Dark Theme',
  args: {
    ...PhotoshopPicker.args,
    theme: 'dark',
  },
};
