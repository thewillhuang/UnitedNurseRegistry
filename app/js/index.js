'use strict';

import React from 'react';
import { App } from './components/app.jsx';
import { Login } from './components/login.jsx';
import { Router, Route, Link } from 'react-router';
import { history } from 'react-router/lib/HashHistory';
import injectTapEventPlugin from 'react-tap-event-plugin';
import mui, { AppBar, FlatButton, LinearProgress } from 'material-ui';
const ThemeManager = new mui.Styles.ThemeManager();

injectTapEventPlugin();

class UNRApp extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
  }
  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }
  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  }
  render() {
    return (
      <div>
        <LinearProgress mode='indeterminate' />
        <AppBar
          showMenuIconButton={false}
          title='Dream Crew'
          iconElementRight={
            <FlatButton
              label='login'
              primary={true}
              linkButton={true}
              href='/#/login'
            />
          }
        />
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/app'>App</Link></li>
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
