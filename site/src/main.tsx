import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/base.scss';
import './styles/layout.scss';
import './styles/tokens.scss';

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
