import { useState } from 'react';

import { CompactPicker } from 'react-color';

function App() {
  const [pickerVisible, setPickerVisible] = useState(false);

  const handleColorChange = ({ hex }) => console.log(hex);
  const onTogglePicker = () => setPickerVisible((currentPickerVisible) => !currentPickerVisible);

  return (
    <div>
      <button onClick={onTogglePicker}>Toggle Picker</button>

      {pickerVisible && (
        <div style={{ position: 'absolute' }}>
          <CompactPicker color="#333" onChangeComplete={handleColorChange} />
        </div>
      )}
    </div>
  );
}

export default App;
