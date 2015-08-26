'use strict';

import React from 'react';
import { Home } from './components/home.jsx';
import { Router, Route } from 'react-router';
import { history } from 'react-router/lib/HashHistory';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

class Root extends React.Component {
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
    <Route path='/' component={Root}>
      <Route path='home' component={Home}/>

      <Route path='app' getComponents={(cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/app.jsx'));
        });
      }} >

        <Route path='/hospitals' getComponents={(cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/hospital.jsx'));
          });
        }}/>

      </Route>

      <Route path='hospitals' getComponents={(cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/hospital.jsx'));
        });
      }}/>

      <Route path='login' getComponents={(cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/login.jsx'));
        });
      }}/>

      <Route path='signup' getComponents={(cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/signup.jsx'));
        });
      }}/>

    </Route>
  </Router>
), document.getElementById('root'));
