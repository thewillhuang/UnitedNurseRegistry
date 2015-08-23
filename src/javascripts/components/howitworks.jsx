'use strict';

import React from 'react';
import mui, { } from 'material-ui';
const ThemeManager = new mui.Styles.ThemeManager();

export class HowItWorks extends React.Component {
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
      <div className='howitworks-wrapper'>
        <div className='howitworks-title'>
          <hr className='style-eight'></hr>
        </div>
      </div>
    );
  }
}
