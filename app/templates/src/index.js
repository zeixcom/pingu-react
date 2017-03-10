import React from 'react';
import { render } from 'react-dom';

import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import createBrowserHistory from 'history/createBrowserHistory';
import { syncHistoryWithStore } from 'react-router-redux';

import { Provider } from 'react-redux';
import createStoreWithMiddleware from './store';
import { defaultState } from './default-state';

// eslint-disable-next-line no-unused-vars
import css from './assets/css/styles.scss';

const browserHistory = createBrowserHistory();
const store = createStoreWithMiddleware(browserHistory, defaultState);
const history = syncHistoryWithStore(browserHistory, store);

const App = () => <div><h1>Hello World!</h1></div>;
const NotFound = () => <div><h1>Not Found</h1></div>;

const router = () => (
  <Provider store={ store }>
    <Router history={ history }>
      <Switch>
        <Route exact path="/" component={ App } />
        <Route component={ NotFound } />
      </Switch>
    </Router>
  </Provider>
);

// eslint-disable-next-line no-undef
render(router(), document.getElementById('root'));
