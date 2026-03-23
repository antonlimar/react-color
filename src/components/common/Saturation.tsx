import React, { Component, PureComponent } from 'react';
import reactCSS from 'reactcss';
import throttle from 'lodash/throttle';
import * as saturation from '../../helpers/saturation';
import type { InternalColorChangeEvent, SaturationProps } from '../../types';

type ThrottledChange = {
  (
    fn: NonNullable<SaturationProps['onChange']>,
    data: ReturnType<typeof saturation.calculateChange>,
    event: InternalColorChangeEvent,
  ): void;
  cancel(): void;
};

const BaseSaturation = (PureComponent || Component) as new (props: SaturationProps) => React.Component<SaturationProps>;

export class Saturation extends BaseSaturation {
  container: HTMLDivElement | null = null;
  throttle: ThrottledChange;

  constructor(props: SaturationProps) {
    super(props);

    this.throttle = throttle(
      (
        fn: NonNullable<SaturationProps['onChange']>,
        data: ReturnType<typeof saturation.calculateChange>,
        event: InternalColorChangeEvent,
      ) => {
        fn(data, event);
      },
      50,
    );
  }

  componentWillUnmount() {
    this.throttle.cancel();
    this.unbindEventListeners();
  }

  getContainerRenderWindow() {
    const { container } = this;
    let renderWindow: Window = window;

    if (!container) {
      return renderWindow;
    }

    while (!renderWindow.document.contains(container) && renderWindow.parent !== renderWindow) {
      renderWindow = renderWindow.parent;
    }

    return renderWindow;
  }

  handleChange = (event: InternalColorChangeEvent) => {
    if (!this.container || typeof this.props.onChange !== 'function') {
      return;
    }

    this.throttle(this.props.onChange, saturation.calculateChange(event, this.props.hsl, this.container), event);
  };

  handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    this.handleChange(event);
    const renderWindow = this.getContainerRenderWindow();
    renderWindow.addEventListener('mousemove', this.handleChange);
    renderWindow.addEventListener('mouseup', this.handleMouseUp);
  };

  handleMouseUp = () => {
    this.unbindEventListeners();
  };

  unbindEventListeners() {
    const renderWindow = this.getContainerRenderWindow();
    renderWindow.removeEventListener('mousemove', this.handleChange);
    renderWindow.removeEventListener('mouseup', this.handleMouseUp);
  }

  render() {
    const { color, white, black, pointer, circle } = this.props.style || {};
    const styles = reactCSS(
      {
        default: {
          color: {
            absolute: '0px 0px 0px 0px',
            background: `hsl(${this.props.hsl.h},100%, 50%)`,
            borderRadius: this.props.radius,
          },
          white: {
            absolute: '0px 0px 0px 0px',
            borderRadius: this.props.radius,
          },
          black: {
            absolute: '0px 0px 0px 0px',
            boxShadow: this.props.shadow,
            borderRadius: this.props.radius,
          },
          pointer: {
            position: 'absolute',
            top: `${-(this.props.hsv.v * 100) + 100}%`,
            left: `${this.props.hsv.s * 100}%`,
            cursor: 'default',
          },
          circle: {
            width: '4px',
            height: '4px',
            boxShadow: `0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0,0,0,.3),
            0 0 1px 2px rgba(0,0,0,.4)`,
            borderRadius: '50%',
            cursor: 'hand',
            transform: 'translate(-2px, -2px)',
          },
        },
        custom: {
          color,
          white,
          black,
          pointer,
          circle,
        },
      },
      { custom: !!this.props.style },
    );

    const Pointer = this.props.pointer;

    return (
      <div
        style={styles.color}
        ref={(container) => {
          this.container = container;
        }}
        onMouseDown={this.handleMouseDown}
        onTouchMove={this.handleChange}
        onTouchStart={this.handleChange}
      >
        <style>{`
          .saturation-white {
            background: -webkit-linear-gradient(to right, #fff, rgba(255,255,255,0));
            background: linear-gradient(to right, #fff, rgba(255,255,255,0));
          }
          .saturation-black {
            background: -webkit-linear-gradient(to top, #000, rgba(0,0,0,0));
            background: linear-gradient(to top, #000, rgba(0,0,0,0));
          }
        `}</style>
        <div style={styles.white} className="saturation-white">
          <div style={styles.black} className="saturation-black" />
          <div style={styles.pointer}>{Pointer ? <Pointer {...this.props} /> : <div style={styles.circle} />}</div>
        </div>
      </div>
    );
  }
}

export default Saturation;
