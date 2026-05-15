import { renderPickerStory } from '@storybook-utils/renderPickerStory';
import { Photoshop } from './Photoshop';

export default {
  title: 'Pickers',
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
  args: {
    header: 'Color Picker',
    styles: {},
  },
};
