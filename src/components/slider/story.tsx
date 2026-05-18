import { renderPickerStory } from '@storybook-utils/renderPickerStory';
import { Slider } from './Slider';

export default {
  title: 'Pickers/Slider Picker',
  component: Slider,
  render: renderPickerStory(Slider),
  argTypes: {
    styles: {
      control: 'object',
    },
  },
};

export const SliderPicker = {
  name: 'Light Theme',
  args: {
    theme: 'light',
    styles: { default: { wrap: { width: 410 } } },
  },
};

export const SliderPickerDark = {
  name: 'Dark Theme',
  args: {
    ...SliderPicker.args,
    theme: 'dark',
  },
};
