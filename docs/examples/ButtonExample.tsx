import type { CSSProperties } from 'react';
import { useState } from 'react';
import { ChromePicker } from 'react-color';

function ButtonExample() {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const popover: CSSProperties = {
    position: 'absolute',
    zIndex: 2,
  };

  const cover: CSSProperties = {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  };

  return (
    <div>
      <button onClick={() => setDisplayColorPicker((state) => !state)}>Pick Color</button>
      {displayColorPicker ? (
        <div style={popover}>
          <div style={cover} onClick={() => setDisplayColorPicker(false)} />
          <ChromePicker />
        </div>
      ) : null}
    </div>
  );
}

export default ButtonExample;
