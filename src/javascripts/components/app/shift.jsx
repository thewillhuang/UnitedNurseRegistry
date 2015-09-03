'use strict';

import React from 'react';
import mui from 'material-ui';
const ThemeManager = new mui.Styles.ThemeManager();
// const MenuItem = require('material-ui/lib/menus/menu-item');
// const MenuDivider = require('material-ui/lib/menus/menu-divider');
// import MediaQuery from 'react-responsive';

class Shift extends React.Component {
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
      <div className='appShift'>
        <div className='appShiftFilter'>
          filter
        </div>
        <div className='appShiftResult'>
          results
        </div>
      </div>
    );
  }
}

export default Shift;
