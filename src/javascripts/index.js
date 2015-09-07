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

      // app route
      <Route path='app' getComponents={(cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/app.jsx'));
        });
      }} >
        // nested app routes
        <Route path='shifts' getComponents={(cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/app/shift.jsx'));
          });
        }}/>

        <Route path='profile' getComponents={(cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/app/profile.jsx'));
          });
        }}/>

      </Route>

      // end of app route

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
