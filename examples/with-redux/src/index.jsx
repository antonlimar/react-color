import { createRoot } from 'react-dom/client';
import { createStore } from 'redux';
import { reducer as app } from './reducer';

import { Provider } from 'react-redux';
import App from './App';

const rootElement = document.getElementById('root');

createRoot(rootElement).render(
  <Provider store={createStore(app)}>
    <App />
  </Provider>,
);
