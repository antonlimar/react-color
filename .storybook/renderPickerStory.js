import { createElement } from 'react';
import SyncColorField from './SyncColorField';

export const renderPickerStory = (Component) => {
  return function PickerStory(args) {
    return createElement(SyncColorField, { component: Component }, createElement(Component, args));
  };
};
