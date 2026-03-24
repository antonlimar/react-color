import Github from './Github';
import { renderPickerStory } from '../../../.storybook/renderPickerStory';

export default {
  title: 'Pickers',
  component: Github,
  render: renderPickerStory(Github),
  argTypes: {
    width: {
      control: { type: 'range', min: 140, max: 500, step: 1 },
    },
    triangle: {
      control: 'select',
      options: ['hide', 'top-left', 'top-right', 'bottom-left', 'bottom-right'],
    },
    colors: {
      control: 'object',
    },
    styles: {
      control: 'object',
    },
  },
};

export const GithubPicker = {
  args: {
    width: 200,
    triangle: 'top-left',
    colors: [
      '#B80000',
      '#DB3E00',
      '#FCCB00',
      '#008B02',
      '#006B76',
      '#1273DE',
      '#004DCF',
      '#5300EB',
      '#EB9694',
      '#FAD0C3',
      '#FEF3BD',
      '#C1E1C5',
      '#BEDADC',
      '#C4DEF6',
      '#BED3F3',
      '#D4C4FB',
    ],
    styles: {},
  },
};
