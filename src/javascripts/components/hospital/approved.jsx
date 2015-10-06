import React from 'react';
import mui from 'material-ui';
// import ShiftHospital from './shiftHospitalTable.jsx';
const ThemeManager = new mui.Styles.ThemeManager();
// const MenuItem = require('material-ui/lib/menus/menu-item');
// const MenuDivider = require('material-ui/lib/menus/menu-divider');
// import MediaQuery from 'react-responsive';
import Approved from './approvedTable.jsx';

class Reviews extends React.Component {
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
        <div className='appShiftResult'>
          <div className='card'>
            <div className='cardTitle'>
              Approved Shifts
            </div>
            <hr className='cardDivider' />
            <div className='cardBody'>
              <Approved />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Reviews;
