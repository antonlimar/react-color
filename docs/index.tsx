import { createRoot } from 'react-dom/client';
import Home from './components/home/Home';
import '../src/styles/index.scss';

if (typeof document !== 'undefined') {
  const container = document.getElementById('root');

  if (container) {
    const root = createRoot(container);
    root.render(<Home />);
  }
}
