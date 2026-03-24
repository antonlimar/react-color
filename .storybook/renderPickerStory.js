import React from 'react';

import SyncColorField from './SyncColorField';

export const renderPickerStory = (Component) => {
  return function PickerStory(args) {
    return React.createElement(SyncColorField, { component: Component }, React.createElement(Component, args));
  };
};
