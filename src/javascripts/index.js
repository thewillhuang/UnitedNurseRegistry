'use strict';

import React from 'react';
import { Home } from './components/home.jsx';
import { Router, Route } from 'react-router';
import { history } from 'react-router/lib/HashHistory';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

class UNRApp extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
  }
  render() {
    return (
      <div>
        { this.props.children || <Home />}
      </div>
    );
  }
}

React.render((
  <Router history={history}>
    <Route path='/' component={UNRApp}>
      <Route path='home' component={Home}/>

      <Route path='app' getComponents={(cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/app.jsx').App);
        });
      }}/>

      <Route path='hospitals' getComponents={(cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/hospital.jsx').Hospital);
        });
      }}/>

      <Route path='login' getComponents={(cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/login.jsx').Login);
        });
      }}/>

      <Route path='signup' getComponents={(cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/signup.jsx').Signup);
        });
      }}/>

    </Route>
  </Router>
), document.getElementById('root'));
