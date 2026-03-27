import React from 'react';
import reactCSS from 'reactcss';

import documentation from '../../documentation';
import { Button, buttonmd, Sketch, sketchmd } from '../../examples';
import { MarkdownBlock, MarkdownDocument, parseFrontmatter } from '../common/MarkdownBlock';

interface HomeDocumentationProps {
  primaryColor: string;
}

interface NavigationItem {
  id: string;
  title: string;
}

function HomeDocumentation({ primaryColor }: HomeDocumentationProps) {
  const styles = reactCSS({
    default: {
      body: {
        paddingTop: '50px',
        paddingBottom: '50px',
      },
      container: {
        maxWidth: '960px',
        margin: '0 auto',
        padding: '0 24px',
      },
      layout: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)',
        gap: '40px',
        alignItems: 'start',
      },
      docsPanel: {
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 18px 40px rgba(0,0,0,.08)',
        padding: '32px',
      },
      section: {
        paddingBottom: '28px',
        marginBottom: '28px',
        borderBottom: '1px solid rgba(0,0,0,.08)',
      },
      heading: {
        fontSize: '28px',
        lineHeight: '34px',
        color: 'rgba(0,0,0,.8)',
        margin: '0 0 16px',
      },
      markdown: {
        color: 'rgba(0,0,0,.72)',
        fontSize: '15px',
        lineHeight: '24px',
      },
      sidebar: {
        position: 'sticky',
        top: '24px',
        display: 'grid',
        gap: '24px',
      },
      card: {
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 18px 40px rgba(0,0,0,.08)',
        padding: '24px',
      },
      example: {
        paddingBottom: '32px',
      },
      exampleTitle: {
        margin: '0 0 16px',
        fontSize: '20px',
        lineHeight: '26px',
        color: 'rgba(0,0,0,.8)',
      },
      playground: {
        background: '#f3f4f6',
        boxShadow: 'inset 0 2px 3px rgba(0,0,0,.08)',
        position: 'relative',
        minHeight: '200px',
        borderRadius: '12px 12px 0 0',
        padding: '24px',
      },
      exampleButton: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      },
      exampleSketch: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      },
      code: {
        background: '#111827',
        color: '#f9fafb',
        borderRadius: '0 0 12px 12px',
        overflow: 'auto',
        padding: '16px',
      },
      navTitle: {
        margin: '0 0 12px',
        fontSize: '14px',
        letterSpacing: '.08em',
        textTransform: 'uppercase',
        color: 'rgba(0,0,0,.45)',
      },
      navList: {
        margin: 0,
        padding: 0,
        listStyle: 'none',
        display: 'grid',
        gap: '8px',
      },
      navLink: {
        color: primaryColor,
        textDecoration: 'none',
        fontSize: '14px',
        lineHeight: '20px',
      },
      repoLink: {
        color: primaryColor,
        textDecoration: 'none',
        fontWeight: '500',
      },
    },
    '@media (max-width: 900px)': {
      layout: {
        gridTemplateColumns: '1fr',
      },
      sidebar: {
        position: 'static',
      },
    },
  });

  const sections = Object.entries(documentation);
  const navItems = sections
    .map(([, document]) => {
      const frontmatter = parseFrontmatter(document);

      if (!frontmatter.id || !frontmatter.title) {
        return null;
      }

      return {
        id: frontmatter.id,
        title: frontmatter.title,
      };
    })
    .filter((item): item is NavigationItem => item !== null);

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.layout}>
          <div style={styles.docsPanel}>
            {sections.map(([key, document]) => (
              <MarkdownDocument
                key={key}
                document={document}
                wrapperStyle={styles.section}
                headingStyle={styles.heading}
                contentStyle={styles.markdown}
              />
            ))}
          </div>

          <div style={styles.sidebar}>
            <div style={styles.card}>
              <div style={styles.navTitle}>Documentation</div>
              <ul style={styles.navList}>
                {navItems.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} style={styles.navLink}>
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div style={styles.card}>
              <div style={styles.example}>
                <h3 style={styles.exampleTitle}>Button Example</h3>
                <div style={styles.playground}>
                  <div style={styles.exampleButton}>
                    <Button />
                  </div>
                </div>
                <MarkdownBlock style={styles.code}>{buttonmd}</MarkdownBlock>
              </div>

              <div>
                <h3 style={styles.exampleTitle}>Sketch Example</h3>
                <div style={styles.playground}>
                  <div style={styles.exampleSketch}>
                    <Sketch />
                  </div>
                </div>
                <MarkdownBlock style={styles.code}>{sketchmd}</MarkdownBlock>
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.navTitle}>Repository</div>
              <a href="https://github.com/casesandberg/react-color" style={styles.repoLink}>
                casesandberg/react-color
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeDocumentation;
