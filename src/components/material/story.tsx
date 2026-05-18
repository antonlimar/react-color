import { renderPickerStory } from '@storybook-utils/renderPickerStory';
import { Material } from './Material';

export default {
  title: 'Pickers/Material Picker',
  component: Material,
  render: renderPickerStory(Material),
  argTypes: {
    styles: {
      control: 'object',
    },
  },
};

export const MaterialPicker = {
  name: 'Light Theme',
  args: {
    theme: 'light',
    styles: {},
  },
};

export const MaterialPickerDark = {
  name: 'Dark Theme',
  args: {
    ...MaterialPicker.args,
    theme: 'dark',
  },
};
