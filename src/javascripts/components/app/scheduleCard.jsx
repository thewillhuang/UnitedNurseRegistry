'use strict';

import React from 'react';
import mui from 'material-ui';
const ThemeManager = new mui.Styles.ThemeManager();

class ScheduleCard extends React.Component {
  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  }

  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }

  render() {
    return (
      <div className='card'>
        <div className='cardTitle'>
          Schedule
        </div>
        <hr className='cardDivider' />
        <div className='cardBody'>
          fields
        </div>
      </div>
    );
  }
}

export default ScheduleCard;
