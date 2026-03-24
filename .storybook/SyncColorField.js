import { cloneElement, Component } from 'react';

export default class SyncColorField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colorField: props.component.defaultProps.color,
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
