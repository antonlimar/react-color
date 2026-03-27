import React, { useState } from 'react';
import reactCSS from 'reactcss';

import HomeFeature from './HomeFeature';
import HomeDocumentation from './HomeDocumentation';

function Home() {
  const [primaryColor, setPrimaryColor] = useState('#194D33');

  const styles = reactCSS({
    default: {
      home: {
        fontFamily: 'Roboto',
      },
    },
  });

  return (
    <div style={styles.home}>
      <style>{`
        html, body {
          background: #eee;
          overflow-x: hidden;
        }
        .flexbox-fix {
          display: -webkit-box;
          display: -moz-box;
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
        }
      `}</style>

      <HomeFeature primaryColor={primaryColor} onChange={setPrimaryColor} />
      <HomeDocumentation primaryColor={primaryColor} />
    </div>
  );
}

export default Home;
