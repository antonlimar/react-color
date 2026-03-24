import { Component } from 'react';
import type { ComponentType, ElementType } from 'react';

type FocusState = {
  focus: boolean;
};

export const handleFocus = <P extends object>(WrappedComponent: ComponentType<P>, Span: ElementType = 'span') =>
  class Focus extends Component<P, FocusState> {
    state: FocusState = { focus: false };

    handleFocus = () => this.setState({ focus: true });

    handleBlur = () => this.setState({ focus: false });

    render() {
      return (
        <Span onFocus={this.handleFocus} onBlur={this.handleBlur}>
          <WrappedComponent {...(this.props as P)} {...(this.state as unknown as Partial<P>)} />
        </Span>
      );
    }
  };
