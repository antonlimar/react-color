import { renderPickerStory } from '@storybook-utils/renderPickerStory';
import { Sketch } from './Sketch';

export default {
  title: 'Pickers/Sketch Picker',
  component: Sketch,
  render: renderPickerStory(Sketch),
  argTypes: {
    width: {
      control: { type: 'range', min: 140, max: 500, step: 1 },
    },
    disableAlpha: {
      control: 'boolean',
    },
    presetColors: {
      control: 'object',
    },
    styles: {
      control: 'object',
    },
  },
};

export const SketchPicker = {
  name: 'Light Theme',
  args: {
    width: 200,
    disableAlpha: false,
    presetColors: [
      '#D0021B',
      '#F5A623',
      '#F8E71C',
      '#8B572A',
      '#7ED321',
      '#417505',
      '#BD10E0',
      '#9013FE',
      '#4A90E2',
      '#50E3C2',
      '#B8E986',
      '#000000',
      '#4A4A4A',
      '#9B9B9B',
      '#FFFFFF',
    ],
    theme: 'light',
    styles: {},
  },
};

export const SketchPickerDark = {
  name: 'Dark Theme',
  args: {
    ...SketchPicker.args,
    theme: 'dark',
  },
};

export const SketchPickerCustomStyles = {
  name: 'Custom Styles',
  args: {
    ...SketchPicker.args,
    styles: {
      default: {
        picker: {
          boxShadow: 'none',
        },
      },
    },
  },
};
