import type { ReactElement } from 'react';
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

type VisualStoryComponent = () => ReactElement;

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

const renderStoryFrame = (story: ReactElement) => {
  return render(
    <div
      data-testid="visual-story-frame"
      style={{
        padding: '24px',
        background: '#f6f7f9',
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
});
