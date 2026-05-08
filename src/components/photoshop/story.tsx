import { Photoshop } from './Photoshop';
import { renderPickerStory } from '../../../.storybook/renderPickerStory';

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
