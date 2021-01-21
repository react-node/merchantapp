import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import App from './App';
import { GlobalProvider } from '../src/context/GlobalState';

ReactDOM.render((
  <GlobalProvider>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </GlobalProvider>
), document.getElementById('root'));

serviceWorker.unregister();
