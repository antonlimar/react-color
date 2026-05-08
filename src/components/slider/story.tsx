import { Slider } from './Slider';
import { renderPickerStory } from '@storybook-utils/renderPickerStory';

export default {
  title: 'Pickers',
  component: Slider,
  render: renderPickerStory(Slider),
  argTypes: {
    styles: {
      control: 'object',
    },
  },
};

export const SliderPicker = {
  args: {
    styles: { default: { wrap: { width: 410 } } },
  },
};
