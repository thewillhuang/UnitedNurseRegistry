'use strict';

import React from 'react';
import mui from 'material-ui';
import ShiftFilter from './shiftFilter.jsx';
import ShiftHospital from './shiftHospitalTable.jsx';
const ThemeManager = new mui.Styles.ThemeManager();
// const MenuItem = require('material-ui/lib/menus/menu-item');
// const MenuDivider = require('material-ui/lib/menus/menu-divider');
// import MediaQuery from 'react-responsive';

class Profile extends React.Component {
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
      <div className='appProfile'>
        <div className='appProfileList'>
          <div className='card'>
            <div className='cardTitle'>
              List
            </div>
            <hr className='cardDivider'/>
            <div className='cardBody'>
              <ShiftFilter getLocation={this.getLocation} />
            </div>
          </div>
        </div>
        <div className='appProfileCards'>
          <div className='card'>
            <div className='cardTitle'>
              Hospitals
            </div>
            <hr className='cardDivider' />
            <div className='cardBody'>
              <ShiftHospital />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
