import type { CSSProperties } from 'react';
import React from 'react';
import { ChromePicker } from 'react-color';

interface ButtonExampleState {
  displayColorPicker: boolean;
}

class ButtonExample extends React.Component<Record<string, never>, ButtonExampleState> {
  state: ButtonExampleState = {
    displayColorPicker: false,
  };

  handleClick = () => {
    this.setState((state) => ({ displayColorPicker: !state.displayColorPicker }));
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  render() {
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
        <button onClick={this.handleClick}>Pick Color</button>
        {this.state.displayColorPicker ? (
          <div style={popover}>
            <div style={cover} onClick={this.handleClose} />
            <ChromePicker />
          </div>
        ) : null}
      </div>
    );
  }
}

export default ButtonExample;
