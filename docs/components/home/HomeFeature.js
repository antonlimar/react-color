'use strict';

import React from 'react';
import reactCSS from 'reactcss';

import {
  AlphaPicker,
  BlockPicker,
  ChromePicker,
  CirclePicker,
  CompactPicker,
  GithubPicker,
  HuePicker,
  MaterialPicker,
  PhotoshopPicker,
  SketchPicker,
  SliderPicker,
  SwatchesPicker,
  TwitterPicker,
} from 'react-color';

class HomeFeature extends React.Component {
  constructor() {
    super();

    this.state = {
      h: 150,
      s: 0.5,
      l: 0.2,
      a: 1,
    };

    this.handleChangeComplete = this.handleChangeComplete.bind(this);
  }

  handleChangeComplete(data) {
    if (data.hsl !== this.state) {
      this.setState(data.hsl);
    }

    if (this.props.onChange) {
      this.props.onChange(data.hex);
    }
  }

  renderCard(label, element, tone = 'default') {
    const styles = reactCSS({
      default: {
        card: {
          position: 'relative',
          padding: '20px',
          borderRadius: '18px',
          minHeight: '100%',
          background: tone === 'dark' ? 'rgba(17,24,39,.82)' : 'rgba(255,255,255,.9)',
          boxShadow: '0 22px 44px rgba(15,23,42,.12)',
          backdropFilter: 'blur(10px)',
        },
        label: {
          marginTop: '14px',
          fontSize: '12px',
          lineHeight: '16px',
          letterSpacing: '.08em',
          textTransform: 'uppercase',
          color: tone === 'dark' ? 'rgba(255,255,255,.7)' : 'rgba(0,0,0,.45)',
        },
      },
    });

    return (
      <div style={styles.card}>
        {element}
        <div style={styles.label}>{label}</div>
      </div>
    );
  }

  render() {
    const styles = reactCSS({
      default: {
        feature: {
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${this.props.primaryColor} 0%, rgba(255,255,255,.72) 100%)`,
        },
        backdrop: {
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at top left, rgba(255,255,255,.55), transparent 45%)',
        },
        container: {
          position: 'relative',
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '56px 24px 72px',
        },
        hero: {
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(320px, .9fr)',
          gap: '32px',
          alignItems: 'start',
        },
        title: {
          margin: 0,
          fontSize: '56px',
          lineHeight: '58px',
          color: 'rgba(0,0,0,.72)',
        },
        subtitle: {
          marginTop: '20px',
          fontSize: '20px',
          lineHeight: '30px',
          color: 'rgba(0,0,0,.5)',
          maxWidth: '520px',
        },
        star: {
          marginTop: '28px',
        },
        logo: {
          width: '24px',
          height: '24px',
          borderRadius: '6px',
          background: 'url("images/react-color.svg") center / cover no-repeat',
          marginBottom: '24px',
        },
        heroPicker: {
          justifySelf: 'end',
        },
        grid: {
          marginTop: '36px',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
          gap: '20px',
        },
        wide: {
          gridColumn: 'span 6',
        },
        medium: {
          gridColumn: 'span 4',
        },
        small: {
          gridColumn: 'span 3',
        },
        twoColumn: {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
        },
      },
      '@media (max-width: 980px)': {
        hero: {
          gridTemplateColumns: '1fr',
        },
        heroPicker: {
          justifySelf: 'start',
        },
        wide: {
          gridColumn: 'span 12',
        },
        medium: {
          gridColumn: 'span 6',
        },
        small: {
          gridColumn: 'span 6',
        },
      },
      '@media (max-width: 720px)': {
        container: {
          padding: '40px 16px 56px',
        },
        title: {
          fontSize: '42px',
          lineHeight: '44px',
        },
        subtitle: {
          fontSize: '18px',
          lineHeight: '28px',
        },
        medium: {
          gridColumn: 'span 12',
        },
        small: {
          gridColumn: 'span 12',
        },
        twoColumn: {
          gridTemplateColumns: '1fr',
        },
      },
    });

    return (
      <div style={styles.feature}>
        <div style={styles.backdrop} />
        <div style={styles.container}>
          <div style={styles.hero}>
            <div>
              <div style={styles.logo} />
              <h1 style={styles.title}>React Color</h1>
              <div style={styles.subtitle}>
                A collection of color pickers from Sketch, Photoshop, Chrome, Github, Twitter, Material Design, and
                more.
              </div>
              <div style={styles.star}>
                <iframe
                  src="https://ghbtns.com/github-btn.html?user=casesandberg&repo=react-color&type=star&count=true&size=large"
                  scrolling="0"
                  width="160px"
                  height="30px"
                  frameBorder="0"
                />
              </div>
            </div>

            <div style={styles.heroPicker}>
              {this.renderCard(
                'Chrome',
                <ChromePicker color={this.state} onChangeComplete={this.handleChangeComplete} />,
              )}
            </div>
          </div>

          <div style={styles.grid}>
            <div style={styles.wide}>
              <div style={styles.twoColumn}>
                {this.renderCard(
                  'Sketch',
                  <SketchPicker color={this.state} onChangeComplete={this.handleChangeComplete} />,
                )}
                {this.renderCard(
                  'Photoshop',
                  <PhotoshopPicker color={this.state} onChangeComplete={this.handleChangeComplete} />,
                )}
              </div>
            </div>

            <div style={styles.medium}>
              {this.renderCard(
                'Slider',
                <SliderPicker color={this.state} onChangeComplete={this.handleChangeComplete} />,
              )}
            </div>

            <div style={styles.small}>
              {this.renderCard(
                'Block',
                <BlockPicker color={this.state} onChangeComplete={this.handleChangeComplete} />,
              )}
            </div>

            <div style={styles.small}>
              {this.renderCard(
                'Github',
                <GithubPicker color={this.state} onChangeComplete={this.handleChangeComplete} triangle="top-right" />,
              )}
            </div>

            <div style={styles.small}>
              {this.renderCard(
                'Twitter',
                <TwitterPicker color={this.state} onChangeComplete={this.handleChangeComplete} triangle="top-right" />,
              )}
            </div>

            <div style={styles.small}>
              {this.renderCard(
                'Circle',
                <CirclePicker color={this.state} onChangeComplete={this.handleChangeComplete} />,
              )}
            </div>

            <div style={styles.small}>
              {this.renderCard('Hue', <HuePicker color={this.state} onChangeComplete={this.handleChangeComplete} />)}
            </div>

            <div style={styles.small}>
              {this.renderCard(
                'Alpha',
                <AlphaPicker color={this.state} onChangeComplete={this.handleChangeComplete} />,
              )}
            </div>

            <div style={styles.small}>
              {this.renderCard(
                'Compact',
                <CompactPicker color={this.state} onChangeComplete={this.handleChangeComplete} />,
              )}
            </div>

            <div style={styles.small}>
              {this.renderCard(
                'Material',
                <MaterialPicker color={this.state} onChangeComplete={this.handleChangeComplete} />,
              )}
            </div>

            <div style={styles.medium}>
              {this.renderCard(
                'Swatches',
                <SwatchesPicker color={this.state} onChangeComplete={this.handleChangeComplete} />,
                'dark',
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomeFeature;
