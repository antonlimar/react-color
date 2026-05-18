import { renderPickerStory } from '@storybook-utils/renderPickerStory';
import { Circle } from './Circle';

export default {
  title: 'Pickers/Circle Picker',
  component: Circle,
  render: renderPickerStory(Circle),
  argTypes: {
    width: {
      control: { type: 'range', min: 140, max: 500, step: 1 },
    },
    circleSize: {
      control: { type: 'range', min: 8, max: 72, step: 4 },
    },
    circleSpacing: {
      control: { type: 'range', min: 7, max: 42, step: 7 },
    },
    colors: {
      control: 'object',
    },
    styles: {
      control: 'object',
    },
  },
};

export const CirclePicker = {
  name: 'Light Theme',
  args: {
    width: 252,
    circleSize: 28,
    circleSpacing: 14,
    colors: [
      '#F44336',
      '#E91E63',
      '#9C27B0',
      '#673AB7',
      '#3F51B5',
      '#2196F3',
      '#03A9F4',
      '#00BCD4',
      '#009688',
      '#4CAF50',
      '#8BC34A',
      '#CDDC39',
      '#FFEB3B',
      '#FFC107',
      '#FF9800',
      '#FF5722',
      '#795548',
      '#607D8B',
    ],
    theme: 'light',
    styles: {},
  },
};

export const CirclePickerDark = {
  name: 'Dark Theme',
  args: {
    ...CirclePicker.args,
    theme: 'dark',
  },
};
