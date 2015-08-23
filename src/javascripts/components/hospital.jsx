'use strict';

import React from 'react';
import mui from 'material-ui';
import { HomeToolBar } from './homeToolBar.jsx';
const ThemeManager = new mui.Styles.ThemeManager();

export class Hospital extends React.Component {
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
          Hospitals
        </h3>
      </div>
    );
  }
}
