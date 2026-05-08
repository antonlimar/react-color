import { Material } from './Material';
import { renderPickerStory } from '../../../.storybook/renderPickerStory';

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
