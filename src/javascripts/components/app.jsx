'use strict';

import React from 'react';
import mui from 'material-ui';
import AppToolBar from './appToolBar.jsx';
const ThemeManager = new mui.Styles.ThemeManager();

class App extends React.Component {
  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }

  static propTypes = {
    children: React.PropTypes.node,
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  }

  render() {
    return (
      <div>
        <AppToolBar />
        <h3>
          Signed-in app
        </h3>
        <div>test
          {this.props.children || 'Welcome to your Dashboard'}
        </div>
      </div>
    );
  }
}

export default App;
