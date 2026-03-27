import React, { useState } from 'react';

import Portal from './Portal';

export function App() {
  const [pickerVisible, setPickerVisible] = useState(false);

  const handleToggleVisibility = () => {
    setPickerVisible((currentPickerVisible) => !currentPickerVisible);
  };

  const handleColorChange = ({ hex }) => console.log(hex);

  return (
    <div>
      <button onClick={handleToggleVisibility}>Pick Color</button>

      {pickerVisible && <Portal onChange={handleColorChange} onClose={handleToggleVisibility} />}
    </div>
  );
}

export default App;
