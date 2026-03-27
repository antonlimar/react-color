import type { ReactNode } from 'react';
import { useState } from 'react';

import { createDocsStyles } from '../../createDocsStyles';
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
import type { ColorResult, HSLAColor } from '../../../src/types';

interface HomeFeatureProps {
  primaryColor: string;
  onChange?: (primaryColor: string) => void;
}

const INITIAL_COLOR: HSLAColor = {
  h: 150,
  s: 0.5,
  l: 0.2,
  a: 1,
};

function renderCard(label: string, element: ReactNode, tone: 'default' | 'dark' = 'default') {
  const styles = createDocsStyles({
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

function HomeFeature({ primaryColor, onChange }: HomeFeatureProps) {
  const [color, setColor] = useState<HSLAColor>(INITIAL_COLOR);

  const handleChangeComplete = (data: ColorResult) => {
    const { hsl, hex } = data;

    if (hsl.h !== color.h || hsl.s !== color.s || hsl.l !== color.l || hsl.a !== color.a) {
      setColor(hsl);
    }

    onChange?.(hex);
  };

  const styles = createDocsStyles({
    default: {
      feature: {
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${primaryColor} 0%, rgba(255,255,255,.72) 100%)`,
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
              A collection of color pickers from Sketch, Photoshop, Chrome, Github, Twitter, Material Design, and more.
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
            {renderCard('Chrome', <ChromePicker color={color} onChangeComplete={handleChangeComplete} />)}
          </div>
        </div>

        <div style={styles.grid}>
          <div style={styles.wide}>
            <div style={styles.twoColumn}>
              {renderCard('Sketch', <SketchPicker color={color} onChangeComplete={handleChangeComplete} />)}
              {renderCard('Photoshop', <PhotoshopPicker color={color} onChangeComplete={handleChangeComplete} />)}
            </div>
          </div>

          <div style={styles.medium}>
            {renderCard('Slider', <SliderPicker color={color} onChangeComplete={handleChangeComplete} />)}
          </div>

          <div style={styles.small}>
            {renderCard('Block', <BlockPicker color={color} onChangeComplete={handleChangeComplete} />)}
          </div>

          <div style={styles.small}>
            {renderCard(
              'Github',
              <GithubPicker color={color} onChangeComplete={handleChangeComplete} triangle="top-right" />,
            )}
          </div>

          <div style={styles.small}>
            {renderCard(
              'Twitter',
              <TwitterPicker color={color} onChangeComplete={handleChangeComplete} triangle="top-right" />,
            )}
          </div>

          <div style={styles.small}>
            {renderCard('Circle', <CirclePicker color={color} onChangeComplete={handleChangeComplete} />)}
          </div>

          <div style={styles.small}>
            {renderCard('Hue', <HuePicker color={color} onChangeComplete={handleChangeComplete} />)}
          </div>

          <div style={styles.small}>
            {renderCard('Alpha', <AlphaPicker color={color} onChangeComplete={handleChangeComplete} />)}
          </div>

          <div style={styles.small}>
            {renderCard('Compact', <CompactPicker color={color} onChangeComplete={handleChangeComplete} />)}
          </div>

          <div style={styles.small}>
            {renderCard('Material', <MaterialPicker color={color} onChangeComplete={handleChangeComplete} />)}
          </div>

          <div style={styles.medium}>
            {renderCard('Swatches', <SwatchesPicker color={color} onChangeComplete={handleChangeComplete} />, 'dark')}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeFeature;
