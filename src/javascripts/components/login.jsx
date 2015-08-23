'use strict';

import React from 'react';
import mui from 'material-ui';
import { HomeToolBar } from './homeToolBar.jsx';
const ThemeManager = new mui.Styles.ThemeManager();

export class Login extends React.Component {
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
        <HomeToolBar />
        <h3>
          Login
        </h3>
      </div>
    );
  }
}