'use strict';

import React from 'react';
import { App } from './components/app.jsx';
import { Login } from './components/login.jsx';
import { Router, Route, Link } from 'react-router';
import { history } from 'react-router/lib/HashHistory';

class UNRApp extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
  }
  render() {
    return (
      <div>
        <h1>app</h1>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/app'>App</Link></li>
          <li><Link to='/login'>Login</Link></li>
        </ul>
        { this.props.children }
      </div>
    );
  }
}

React.render((
  <Router history={history}>
    <Route path='/' component={UNRApp}>
      <Route path='app' component={App}/>
      <Route path='login' component={Login}/>
    </Route>
  </Router>
), document.getElementById('root'));
