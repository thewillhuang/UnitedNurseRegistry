'use strict';

import React from 'react';
import mui, { Toolbar, ToolbarGroup, RaisedButton } from 'material-ui';
const ThemeManager = new mui.Styles.ThemeManager();

export class HomeToolBar extends React.Component {
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
        <Toolbar style={{
          backgroundColor: 'rbga(255,255,255,0.6)',
          paddingTop: 20,
          marginBottom: 20,
        }}>
          <ToolbarGroup key={0} float='left'>
            <RaisedButton
              label='Dream Crew'
              linkButton={true}
              href='#home'
              primary={true} />
          </ToolbarGroup>
          <ToolbarGroup key={1} float='right'>
            <RaisedButton
              label='Signup'
              linkButton={true}
              href='#signup'
              secondary={true} />
            <RaisedButton
              label='Login'
              linkButton={true}
              href='#login'
              primary={true} />
          </ToolbarGroup>
        </Toolbar>
      </div>
    );
  }
}
