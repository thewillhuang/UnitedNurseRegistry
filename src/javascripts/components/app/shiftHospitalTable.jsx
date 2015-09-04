'use strict';

import React from 'react';
import mui from 'material-ui';
import geohash from 'ngeohash';
import request from 'superagent';
const ThemeManager = new mui.Styles.ThemeManager();
// const MenuItem = require('material-ui/lib/menus/menu-item');
// const MenuDivider = require('material-ui/lib/menus/menu-divider');
// import MediaQuery from 'react-responsive';

class ShiftHospitalTable extends React.Component {
  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  }

  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }

  state = {
    rows: [],
  }

  getLocation = () => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    const success = (pos) => {
      const geoHash = geohash.encode(pos.coords.latitude, pos.coords.longitude, 4);
      const geoHashSet = geohash.neighbors(geoHash);
      this.setState({
        geohash: geoHash,
        geohashset: geoHashSet,
      });
      this.queryDb();
    };
    const error = (err) => {
      console.log(err);
    };

    navigator.geolocation.getCurrentPosition(success, error, options);
  }

  queryDb() {
    const ctx = this;
    request
      .post('/api/shift/geohash/' + ctx.state.geohash + '/precision/' + 4)
      .set({
        Authorization: sessionStorage.getItem('token'),
      })
      .send({
        hashSet: ctx.state.geohashset,
      })
      .end(function(err, res) {
        console.log(err);
        console.log(res.body.rows);
        ctx.setState({
          rows: res.body.rows,
        });
      });
  }

  componentDidMount() {
    this.getLocation();
  }

  render() {
    console.log(this.state.rows);
    return (
      <div>
      </div>
    );
  }
}

export default ShiftHospitalTable;
