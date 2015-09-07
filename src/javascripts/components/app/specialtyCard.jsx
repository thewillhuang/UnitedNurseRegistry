'use strict';

import React from 'react';
import mui from 'material-ui';
const ThemeManager = new mui.Styles.ThemeManager();

class SpecialtyCard extends React.Component {
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
          Specialty
        </div>
        <hr className='cardDivider' />
        <div className='cardBody'>
          fields
        </div>
      </div>
    );
  }
}

export default SpecialtyCard;
