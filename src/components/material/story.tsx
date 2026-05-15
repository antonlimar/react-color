import { renderPickerStory } from '@storybook-utils/renderPickerStory';
import { Material } from './Material';

export default {
  title: 'Pickers',
  component: Material,
  render: renderPickerStory(Material),
  argTypes: {
    styles: {
      control: 'object',
    },
  },
};

export const MaterialPicker = {
  args: {
    styles: {},
  },
};
