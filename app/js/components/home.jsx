'use strict';

import React from 'react';
import mui, { Card, CardHeader, Avatar } from 'material-ui';
import { HomeToolBar } from './homeToolBar.jsx';
const ThemeManager = new mui.Styles.ThemeManager();

export class Home extends React.Component {
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
        <Card>
          <CardHeader
              title='Title'
              subtitle='Subtitle'
              avatar={<Avatar>A</Avatar>}/>
        </Card>
      </div>
    );
  }
}
