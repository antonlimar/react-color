import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '../../src/styles/index.scss';
import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
