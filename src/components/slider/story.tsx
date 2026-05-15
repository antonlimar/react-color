import { renderPickerStory } from '@storybook-utils/renderPickerStory';
import { Slider } from './Slider';

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
