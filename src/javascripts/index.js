'use strict';

import React from 'react';
import { App } from './components/app.jsx';
import { Login } from './components/login.jsx';
import { Signup } from './components/signup.jsx';
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
      <Route path='app' component={App}/>
      <Route path='login' component={Login}/>
      <Route path='signup' component={Signup}/>
    </Route>
  </Router>
), document.getElementById('root'));
