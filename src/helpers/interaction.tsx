import React from 'react'

type FocusState = {
  focus: boolean
}

export const handleFocus = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  Span: React.ElementType = 'span',
) =>
  class Focus extends React.Component<P, FocusState> {
    state: FocusState = { focus: false }

    handleFocus = () => this.setState({ focus: true })

    handleBlur = () => this.setState({ focus: false })

    render() {
      return (
        <Span onFocus={ this.handleFocus } onBlur={ this.handleBlur }>
          <WrappedComponent { ...(this.props as P) } { ...(this.state as unknown as Partial<P>) } />
        </Span>
      )
    }
  }
