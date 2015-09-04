'use strict';

import React from 'react';
import mui from 'material-ui';
import geohash from 'ngeohash';
import ShiftFilter from './shiftFilter.jsx';
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

  getLocation = () => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    const success = (pos) => {
      this.setState({
        geohash: geohash.encode(pos.coords.latitude, pos.coords.longitude),
        geohashset: geohash.neighbors(geohash.encode(pos.coords.latitude, pos.coords.longitude)),
      });
      console.log(this.state.geohash);
      console.log(this.state.geohashset);
    };
    const error = (err) => {
      console.log(err);
    };
    navigator.geolocation.getCurrentPosition(success, error, options);
  }

  render() {
    this.getLocation();
    return (
      <div className='appShift'>
        <div className='appShiftFilter'>
          <div className='card'>
            <div className='cardTitle'>
              Filter
            </div>
            <hr className='cardDivider'/>
            <div className='cardBody'>
              <ShiftFilter />
            </div>
          </div>
        </div>
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
