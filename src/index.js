import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './views/App.jsx';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'mobx-react';
import appState from './store/app-state';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <Provider appState={appState}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);
registerServiceWorker();
