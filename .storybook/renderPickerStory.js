import React from 'react';

import SyncColorField from './SyncColorField';

export const renderPickerStory = (Component) => {
  return function PickerStory(args) {
    return (
      <SyncColorField component={Component}>
        <Component {...args} />
      </SyncColorField>
    );
  };
};
