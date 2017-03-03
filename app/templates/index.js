import React from 'react';
import { render } from 'react-dom';

import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import { Provider } from 'react-redux';
import createStoreWithMiddleware from './store';
import { defaultState } from './defaultState';

// eslint-disable-next-line no-unused-vars
import css from './assets/style.scss';

const store = createStoreWithMiddleware(browserHistory, defaultState);
const history = syncHistoryWithStore(browserHistory, store);

const App = () => <div><h1>Hello World!</h1></div>;

const router = () => (
  <Provider store={ store }>
    <Router history={ history }>
      <Route path="/" component={ App }>
        <IndexRoute />
      </Route>
    </Router>
  </Provider>
);

// eslint-disable-next-line no-undef
render(router(), document.getElementById('app'));
