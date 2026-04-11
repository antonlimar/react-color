import { createElement } from 'react';
import type { ComponentType, ReactElement } from 'react';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react-vite';
import { describe, expect, test } from 'vitest';

import * as blockStories from '../../src/components/block/story';
import * as chromeStories from '../../src/components/chrome/story';
import * as circleStories from '../../src/components/circle/story';
import * as compactStories from '../../src/components/compact/story';
import * as githubStories from '../../src/components/github/story';
import * as googleStories from '../../src/components/google/story';
import * as materialStories from '../../src/components/material/story';
import * as photoshopStories from '../../src/components/photoshop/story';
import * as sketchStories from '../../src/components/sketch/story';
import * as swatchesStories from '../../src/components/swatches/story';
import * as twitterStories from '../../src/components/twitter/story';

type VisualStoryComponent = ComponentType<Record<string, unknown>>;
type VisualStoryArgs = Record<string, unknown>;

const composePickerStories = (storiesModule: unknown) =>
  composeStories(storiesModule as never) as Record<string, VisualStoryComponent>;

const storyGroups = [
  ['block', composePickerStories(blockStories)],
  ['chrome', composePickerStories(chromeStories)],
  ['circle', composePickerStories(circleStories)],
  ['compact', composePickerStories(compactStories)],
  ['github', composePickerStories(githubStories)],
  ['google', composePickerStories(googleStories)],
  ['material', composePickerStories(materialStories)],
  ['photoshop', composePickerStories(photoshopStories)],
  ['sketch', composePickerStories(sketchStories)],
  ['swatches', composePickerStories(swatchesStories)],
  ['twitter', composePickerStories(twitterStories)],
] as const;

const themedVisualCases: Array<{
  groupName: string;
  storyName: string;
  screenshotName: string;
  args: VisualStoryArgs;
  frameBackground: string;
}> = [
  {
    groupName: 'block',
    storyName: 'BlockPicker',
    screenshotName: 'block/BlockPicker-dark',
    args: { theme: 'dark' },
    frameBackground: '#111827',
  },
  {
    groupName: 'chrome',
    storyName: 'ChromePicker',
    screenshotName: 'chrome/ChromePicker-dark',
    args: { theme: 'dark' },
    frameBackground: '#0f1720',
  },
  {
    groupName: 'circle',
    storyName: 'CirclePicker',
    screenshotName: 'circle/CirclePicker-dark',
    args: { theme: 'dark' },
    frameBackground: '#111827',
  },
  {
    groupName: 'compact',
    storyName: 'CompactPicker',
    screenshotName: 'compact/CompactPicker-dark',
    args: { theme: 'dark' },
    frameBackground: '#111827',
  },
  {
    groupName: 'github',
    storyName: 'GithubPicker',
    screenshotName: 'github/GithubPicker-dark',
    args: { theme: 'dark' },
    frameBackground: '#0f1720',
  },
  {
    groupName: 'google',
    storyName: 'GooglePicker',
    screenshotName: 'google/GooglePicker-dark',
    args: { theme: 'dark' },
    frameBackground: '#111827',
  },
  {
    groupName: 'material',
    storyName: 'MaterialPicker',
    screenshotName: 'material/MaterialPicker-dark',
    args: { theme: 'dark' },
    frameBackground: '#111827',
  },
  {
    groupName: 'sketch',
    storyName: 'SketchPicker',
    screenshotName: 'sketch/SketchPicker-dark',
    args: { theme: 'dark' },
    frameBackground: '#111827',
  },
  {
    groupName: 'photoshop',
    storyName: 'PhotoshopPicker',
    screenshotName: 'photoshop/PhotoshopPicker-dark',
    args: { theme: 'dark' },
    frameBackground: '#0b1220',
  },
  {
    groupName: 'swatches',
    storyName: 'SwatchesPicker',
    screenshotName: 'swatches/SwatchesPicker-dark',
    args: { theme: 'dark' },
    frameBackground: '#111827',
  },
  {
    groupName: 'twitter',
    storyName: 'TwitterPicker',
    screenshotName: 'twitter/TwitterPicker-dark',
    args: { theme: 'dark' },
    frameBackground: '#111827',
  },
];

const renderStoryFrame = (story: ReactElement, frameBackground = '#f6f7f9') => {
  return render(
    <div
      data-testid="visual-story-frame"
      style={{
        padding: '24px',
        background: frameBackground,
        display: 'inline-block',
      }}
    >
      {story}
    </div>,
  );
};

describe('picker visual snapshots', () => {
  for (const [groupName, stories] of storyGroups) {
    for (const [storyName, Story] of Object.entries(stories)) {
      test(`${groupName}/${storyName}`, async () => {
        const { getByTestId } = renderStoryFrame(<Story />);
        const browserExpect = expect as typeof expect & {
          element: (target: HTMLElement) => {
            toMatchScreenshot: (name: string) => Promise<void>;
          };
        };

        await browserExpect.element(getByTestId('visual-story-frame')).toMatchScreenshot(`${groupName}/${storyName}`);
      });
    }
  }

  for (const visualCase of themedVisualCases) {
    test(visualCase.screenshotName, async () => {
      const stories = storyGroups.find(([groupName]) => groupName === visualCase.groupName)?.[1];

      expect(stories).toBeTruthy();
      const Story = stories?.[visualCase.storyName];
      expect(Story).toBeTruthy();
      if (!Story) {
        throw new Error(`Expected visual story ${visualCase.screenshotName} to exist`);
      }

      const { getByTestId } = renderStoryFrame(createElement(Story, visualCase.args), visualCase.frameBackground);
      const browserExpect = expect as typeof expect & {
        element: (target: HTMLElement) => {
          toMatchScreenshot: (name: string) => Promise<void>;
        };
      };

      await browserExpect.element(getByTestId('visual-story-frame')).toMatchScreenshot(visualCase.screenshotName);
    });
  }
});
