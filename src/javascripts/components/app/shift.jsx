'use strict';

import React from 'react';
import mui from 'material-ui';
// import ShiftFilter from './shiftFilter.jsx';
import ShiftHospital from './shiftHospitalTable.jsx';
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
        // <div className='appShiftFilter'>
        //   <div className='card'>
        //     <div className='cardTitle'>
        //       Filter
        //     </div>
        //     <hr className='cardDivider'/>
        //     <div className='cardBody'>
        //       <ShiftFilter getLocation={this.getLocation} />
        //     </div>
        //   </div>
        // </div>
  render() {
    return (
      <div className='appShift'>
        <div className='appShiftResult'>
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

export default Shift;
