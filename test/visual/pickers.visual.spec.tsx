import { composeStories } from '@storybook/react-vite';
import { render } from '@testing-library/react';
import { createElement } from 'react';
import { describe, expect, test } from 'vitest';
import type { ComponentType, ReactElement } from 'react';
import alphaMeta, { AlphaPicker } from '../../src/components/alpha/story';
import blockMeta, { BlockPicker } from '../../src/components/block/story';
import chromeMeta, { ChromePicker } from '../../src/components/chrome/story';
import circleMeta, { CirclePicker } from '../../src/components/circle/story';
import compactMeta, { CompactPicker } from '../../src/components/compact/story';
import githubMeta, { GithubPicker } from '../../src/components/github/story';
import googleMeta, { GooglePicker } from '../../src/components/google/story';
import hueMeta, { HuePicker } from '../../src/components/hue/story';
import materialMeta, { MaterialPicker } from '../../src/components/material/story';
import photoshopMeta, { PhotoshopPicker } from '../../src/components/photoshop/story';
import sketchMeta, { SketchPicker, SketchPickerCustomStyles } from '../../src/components/sketch/story';
import sliderMeta, { SliderPicker } from '../../src/components/slider/story';
import swatchesMeta, { SwatchesPicker } from '../../src/components/swatches/story';
import twitterMeta, { TwitterPicker } from '../../src/components/twitter/story';

type VisualStoryComponent = ComponentType<Record<string, unknown>>;
type VisualStoryArgs = Record<string, unknown>;

const composePickerStories = (storiesModule: unknown) =>
  composeStories(storiesModule as never) as Record<string, VisualStoryComponent>;

const storyGroups = [
  ['alpha', composePickerStories({ default: alphaMeta, AlphaPicker })],
  ['block', composePickerStories({ default: blockMeta, BlockPicker })],
  ['chrome', composePickerStories({ default: chromeMeta, ChromePicker })],
  ['circle', composePickerStories({ default: circleMeta, CirclePicker })],
  ['compact', composePickerStories({ default: compactMeta, CompactPicker })],
  ['github', composePickerStories({ default: githubMeta, GithubPicker })],
  ['google', composePickerStories({ default: googleMeta, GooglePicker })],
  ['hue', composePickerStories({ default: hueMeta, HuePicker })],
  ['material', composePickerStories({ default: materialMeta, MaterialPicker })],
  ['photoshop', composePickerStories({ default: photoshopMeta, PhotoshopPicker })],
  ['sketch', composePickerStories({ default: sketchMeta, SketchPicker, SketchPickerCustomStyles })],
  ['slider', composePickerStories({ default: sliderMeta, SliderPicker })],
  ['swatches', composePickerStories({ default: swatchesMeta, SwatchesPicker })],
  ['twitter', composePickerStories({ default: twitterMeta, TwitterPicker })],
] as const;

const themedVisualCases: Array<{
  groupName: string;
  storyName: string;
  screenshotName: string;
  args: VisualStoryArgs;
  frameBackground: string;
}> = [
  {
    groupName: 'alpha',
    storyName: 'AlphaPicker',
    screenshotName: 'alpha/AlphaPicker-dark',
    args: { theme: 'dark' },
    frameBackground: '#111827',
  },
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
    groupName: 'hue',
    storyName: 'HuePicker',
    screenshotName: 'hue/HuePicker-dark',
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
    groupName: 'slider',
    storyName: 'SliderPicker',
    screenshotName: 'slider/SliderPicker-dark',
    args: { theme: 'dark' },
    frameBackground: '#111827',
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

const classNameVisualCases: Array<{
  groupName: string;
  storyName: string;
  screenshotName: string;
  args: VisualStoryArgs;
  frameBackground: string;
  stylesheet: string;
}> = [
  {
    groupName: 'sketch',
    storyName: 'SketchPicker',
    screenshotName: 'sketch/SketchPicker-classNames',
    args: { className: 'visual-sketch-root' },
    frameBackground: '#f3f4f6',
    stylesheet: `
      .visual-sketch-root {
        border: 3px solid #0f172a;
        border-radius: 14px;
        box-shadow: 0 16px 40px rgba(15, 23, 42, 0.18);
        overflow: hidden;
      }
    `,
  },
];

const renderStoryFrame = (story: ReactElement, frameBackground = '#f6f7f9', stylesheet?: string) => {
  return render(
    <div
      data-testid="visual-story-frame"
      style={{
        padding: '24px',
        background: frameBackground,
        display: 'inline-block',
      }}
    >
      {stylesheet ? <style>{stylesheet}</style> : null}
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

  for (const visualCase of classNameVisualCases) {
    test(visualCase.screenshotName, async () => {
      const stories = storyGroups.find(([groupName]) => groupName === visualCase.groupName)?.[1];

      expect(stories).toBeTruthy();
      const Story = stories?.[visualCase.storyName];
      expect(Story).toBeTruthy();
      if (!Story) {
        throw new Error(`Expected visual story ${visualCase.screenshotName} to exist`);
      }

      const { getByTestId } = renderStoryFrame(
        createElement(Story, visualCase.args),
        visualCase.frameBackground,
        visualCase.stylesheet,
      );
      const browserExpect = expect as typeof expect & {
        element: (target: HTMLElement) => {
          toMatchScreenshot: (name: string) => Promise<void>;
        };
      };

      await browserExpect.element(getByTestId('visual-story-frame')).toMatchScreenshot(visualCase.screenshotName);
    });
  }
});
