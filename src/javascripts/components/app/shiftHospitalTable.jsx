import React from 'react';
import mui, {Snackbar} from 'material-ui';
const ThemeManager = new mui.Styles.ThemeManager();
import {Table, Column} from 'fixed-data-table';
import getGeoHash from '../../utils/getGeoHash.js';
import shiftApi from '../../actions/webapi/shiftApi.js';
import io from 'socket.io-client';
const socket = io.connect();
import _ from 'lodash';
import ghash from 'ngeohash';
import moment from 'moment';
import geolib from 'geolib';
import calcIc from '../../utils/icPay.js';
import calcW2 from '../../utils/w2Pay.js';

const SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};

class ShiftHospitalTable extends React.Component {
  state = {
    table: [
      ['data', 'data', 'data', 'data', 'data', 'data', 'data', 'data', 'data', 'data', 'data'],
    ],
    sortBy: 0,
    sortDir: null,
    focus: null,
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  }

  rowGetter = (rowIndex) => {
    return this.state.table[rowIndex];
  }

  componentDidMount() {
    // grab geohash then execute the search
    const ctx = this;
    async function search() {
      try {
        // grab geo hash
        const geoHash = await getGeoHash();
        ctx.setState({
          geoHash: geoHash,
        });
        // use geo hash to grab search results
        const latlong = ghash.decode(geoHash.geoHash);
        ctx.setState({
          lat: latlong.latitude,
          lng: latlong.longitude,
        });

        const data = await shiftApi.getShiftWithGeoHash(ctx.state.geoHash.geoHash, ctx.state.geoHash.geoHashSet, 3);
        // save the results
        ctx.setState({
          data: data.rows,
        });

        const searchFacilityIDs = [];
        for (let i = 0; i < data.rows.length; i++) {
          searchFacilityIDs.push(data.rows[i].facilityID);
        }

        // grab list of facility Ids return from the result
        ctx.setState({
          facilityIDs: _.uniq(searchFacilityIDs),
        });

        // change array of object to array of arrays for table user who what where when
        const table = [];
        const rows = data.rows;
        for (let i = 0; i < rows.length; i++) {
          const el = rows[i];
          if (el.facilityGeohash) {
            const latlng = ghash.decode(el.facilityGeohash);
            const lat = latlng.latitude;
            const lng = latlng.longitude;
            const distKm = geolib.getDistance(
              {latitude: lat, longitude: lng},
              {latitude: ctx.state.lat, longitude: ctx.state.lng}
            );
            const distMi = distKm / 1000 * 0.621371;
            const total = el.payPerHour * el.shiftDuration;
            table.push([
              el.shiftID,
              el.facilityName,
              // el.payPerHour,
              el.shiftDuration + ' hrs',
              el.specialty,
              '$ ' + calcW2(total),
              '$ ' + calcIc(total),
              el.facilityEMR,
              el.shiftDressCode,
              distMi.toFixed(2),
              moment(el.date).format('MM-DD-YYYY'),
              el.shiftStartHour,
              moment(el.shift_modified).format('MM-DD-YYYY, h:mm a'),
            ]);
            // console.log(ctx.state.lat, ctx.state.lng, lat, lng, distKm, distMi);
          }
        }
        // console.log('table', table);
        ctx.setState({
          table: table,
          sortDir: SortTypes.ASC,
        });
        // sort the table
        ctx._sortRowsBy(0);
      } catch (e) {
        console.log(e);
      }
    }

    socket.on('connect', function() {
      console.log('table connected');
    });

    socket.on('update shift', function(data) {
      console.log('server received a new shift regarding facility', data.facility);
      if (_.includes(ctx.state.facilityIDs, data.facility)) {
        ctx.refs.submitted.show();
        search();
      }
    });

    search();
  }

  _sortRowsBy = (cellDataKey) => {
    let sortDir = this.state.sortDir;
    const sortBy = cellDataKey;
    if (sortBy === this.state.sortBy) {
      sortDir = this.state.sortDir === SortTypes.ASC ? SortTypes.DESC : SortTypes.ASC;
    } else {
      sortDir = SortTypes.DESC;
    }

    const table = this.state.table.slice();
    table.sort((a, b) => {
      let sortVal = 0;
      if (a[sortBy] > b[sortBy]) {
        sortVal = 1;
      }
      if (a[sortBy] < b[sortBy]) {
        sortVal = -1;
      }

      if (sortDir === SortTypes.DESC) {
        sortVal = sortVal * -1;
      }

      return sortVal;
    });

    this.setState({
      table,
      sortBy,
      sortDir,
    });
  }

  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }

  _renderHeader = (label, cellDataKey) => {
    return (
      <a onClick={this._sortRowsBy.bind(null, cellDataKey)} style={{cursor: 'pointer', color: '#00526c'}}>{label}</a>
    );
  }

  onRowClick = (a, b, c) => {
    console.log(a, b, c);
    this.setState({
      focus: c,
    });
  }

  render() {
    console.log(this.state);
    let sortDirArrow = '';

    if (this.state.sortDir !== null) {
      sortDirArrow = this.state.sortDir === SortTypes.DESC ? ' ↓' : ' ↑';
    }

    return (
      <div>
        <Snackbar
          ref='submitted'
          action='OK'
          message='Shift Added'
          autoHideDuration={1000}
          />
        <Table
          rowHeight={50}
          rowGetter={this.rowGetter}
          rowsCount={this.state.table.length}
          onRowClick={this.onRowClick}
          width={1090}
          height={550}
          headerHeight={50}>
          <Column
            width={100}
            label={'Shift ID' + (this.state.sortBy === 0 ? sortDirArrow : '')}
            headerRenderer={this._renderHeader}
            allowCellsRecycling
            dataKey={0}
          />
          <Column
            label={'Facility Name' + (this.state.sortBy === 1 ? sortDirArrow : '')}
            headerRenderer={this._renderHeader}
            width={150}
            allowCellsRecycling
            dataKey={1}
          />
          <Column
            label={'Duration' + (this.state.sortBy === 2 ? sortDirArrow : '')}
            headerRenderer={this._renderHeader}
            flexGrow={1}
            width={100}
            allowCellsRecycling
            dataKey={2}
          />
          <Column
            label={'Specialty' + (this.state.sortBy === 3 ? sortDirArrow : '')}
            headerRenderer={this._renderHeader}
            flexGrow={1}
            width={100}
            allowCellsRecycling
            dataKey={3}
          />
          <Column
            label={'Pay As Employee' + (this.state.sortBy === 4 ? sortDirArrow : '')}
            headerRenderer={this._renderHeader}
            flexGrow={1}
            width={150}
            allowCellsRecycling
            dataKey={4}
          />
          <Column
            label={'Pay As IC' + (this.state.sortBy === 5 ? sortDirArrow : '')}
            headerRenderer={this._renderHeader}
            flexGrow={1}
            width={100}
            allowCellsRecycling
            dataKey={5}
          />
          <Column
            label={'EMR' + (this.state.sortBy === 6 ? sortDirArrow : '')}
            headerRenderer={this._renderHeader}
            flexGrow={1}
            width={110}
            allowCellsRecycling
            dataKey={6}
          />
          <Column
            label={'Dress Code' + (this.state.sortBy === 7 ? sortDirArrow : '')}
            headerRenderer={this._renderHeader}
            flexGrow={1}
            width={120}
            allowCellsRecycling
            dataKey={7}
          />
          <Column
            label={'Miles' + (this.state.sortBy === 8 ? sortDirArrow : '')}
            headerRenderer={this._renderHeader}
            flexGrow={1}
            width={70}
            allowCellsRecycling
            dataKey={8}
          />
          <Column
            label={'Start Date' + (this.state.sortBy === 9 ? sortDirArrow : '')}
            headerRenderer={this._renderHeader}
            flexGrow={1}
            width={100}
            allowCellsRecycling
            dataKey={9}
          />
          <Column
            label={'Start Time' + (this.state.sortBy === 10 ? sortDirArrow : '')}
            headerRenderer={this._renderHeader}
            flexGrow={1}
            width={110}
            allowCellsRecycling
            dataKey={10}
          />
          <Column
            label={'Modified' + (this.state.sortBy === 11 ? sortDirArrow : '')}
            headerRenderer={this._renderHeader}
            flexGrow={2}
            width={120}
            allowCellsRecycling
            dataKey={11}
          />
        </Table>
      </div>
    );
  }
}

export default ShiftHospitalTable;
