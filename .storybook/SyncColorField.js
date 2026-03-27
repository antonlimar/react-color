import { cloneElement, Component } from 'react';

const fallbackColor = {
  h: 250,
  s: 0.5,
  l: 0.2,
  a: 1,
};

export default class SyncColorField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colorField: props.children.props.color ?? fallbackColor,
    };
  }

  render() {
    const handleChange = ({ hex }) => this.setState({ colorField: hex });

    return cloneElement(this.props.children, {
      onChange: handleChange,
      color: this.state.colorField,
    });
  }
}
