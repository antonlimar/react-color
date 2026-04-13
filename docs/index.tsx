import { createRoot } from 'react-dom/client';

import '../src/styles/index.scss';
import Home from './components/home/Home';

if (typeof document !== 'undefined') {
  const container = document.getElementById('root');

  if (container) {
    const root = createRoot(container);
    root.render(<Home />);
  }
}
