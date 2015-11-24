import React from 'react';
import {Snackbar, Dialog, FlatButton} from 'material-ui';
import {Table, Column} from 'fixed-data-table';
import getGeoHash from '../../utils/getGeoHash.js';
import shiftApi from '../../webapi/shiftApi.js';
import shiftStatusApi from '../../webapi/shiftStatusApi.js';
import io from 'socket.io-client';
const socket = io.connect();
import _ from 'lodash';
import ghash from 'ngeohash';
import moment from 'moment';
import geolib from 'geolib';
import calcIc from '../../utils/icPay.js';
import user from '../../utils/grabUser.js';
const userID = user.scope.userID;
import calcW2 from '../../utils/w2Pay.js';
import userApi from '../../webapi/userApi.js';

const SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};

function returnHeight(offset = -250) {
  return Math.max(document.documentElement.clientHeight, window.innerHeight || 0) + offset;
}

function returnWidth(offset = -360) {
  const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) + offset;
  return width;
}

const ShiftHospitalTable = React.createClass({
  getInitialState: function() {
    return {
      table: [
        ['data', 'data', 'data', 'data', 'data', 'data', 'data', 'data', 'data', 'data', 'data'],
      ],
      sortBy: 0,
      sortDir: null,
      focus: ['data', 'data', 'data', 'data', 'data', 'data', 'data', 'data', 'data', 'data', 'data'],
      w: returnWidth(),
      h: returnHeight(),
    };
  },

  rowGetter(rowIndex) {
    return this.state.table[rowIndex];
  },

  searchFailed: function() {
    const ctx = this;
    async function retry() {
      try {
        const userGeoHash = await userApi.getUser(userID);
        const latlong = ghash.decode(userGeoHash);
        ctx.setState({
          lat: latlong.latitude,
          lng: latlong.longitude,
        });
        const slicedGeoHash = userGeoHash.rows[0].userGeoHash.slice(0, 3);
        // console.log(userGeoHash.rows[0].userGeoHash);
        // console.log(slicedGeoHash);
        const geoHashSet = ghash.neighbors(slicedGeoHash);
        // console.log(geoHashSet);
        const geoHash = {};
        geoHash.geoHash = slicedGeoHash;
        geoHash.geoHashSet = geoHashSet;
        console.log('hash set from user info', geoHash);
        ctx.setState({
          geoHash: geoHash,
        });
        ctx.constructTable();
      } catch (e) {
        console.log('search user db failed', e);
      }
    }
    retry();
  },

  setLocation: function() {
    const ctx = this;
    async function setHash() {
      try {
        const geoHash = await getGeoHash();
        console.log('location set', geoHash);
        ctx.setState({
          geoHash: geoHash,
        });
        // use geo hash to grab search results
        const latlong = ghash.decode(geoHash.geoHash);
        ctx.setState({
          lat: latlong.latitude,
          lng: latlong.longitude,
        });
        ctx.constructTable();
      } catch (e) {
        console.log('setlocation error', e);
        ctx.searchFailed();
      }
    }
    setHash();
  },

  constructTable: function() {
    const ctx = this;
    async function search() {
      try {
        const data = await shiftApi.getShiftWithGeoHash(ctx.state.geoHash.geoHash, ctx.state.geoHash.geoHashSet, 3);
        // save the results
        ctx.setState({
          data: data.rows,
        });

        // console.log(data);

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
        // console.log(rows);
        const today = moment().subtract(12, 'hours').format('YYYY-MM-DD');
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
            // const date = moment(el.date).format('YYYY-MM-DD');
            const date = el.date.split('T')[0];
            if (date >= today) {
              table.push([
                el.shiftID,
                el.facilityID,
                el.facilityName,
                // el.payPerHour,
                el.shiftDuration + ' hrs',
                el.specialty.toUpperCase(),
                '$ ' + calcW2(total),
                '$ ' + calcIc(total),
                el.facilityEMR,
                el.shiftDressCode,
                distMi.toFixed(2),
                date,
                el.shiftStartHour,
                moment(el.shift_modified).format('YYYY-MM-DD, h:mm a'),
              ]);
            }
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
        console.log('construct table failed', e);
      }
    }
    search();
  },

  resize: function() {
    this.setState({
      w: returnWidth(),
      h: returnHeight(),
    });
  },

  componentDidMount() {
    window.onresize = this.resize;
    this.setLocation();

    // socket.on('connect', function() {
    //   console.log('table connected');
    // });

    socket.on('updated', function(data) {
      console.log('server received a new shift regarding facility', data.facility);
      // console.log(this);
      if (_.includes(this.state.facilityIDs, data.facility)) {
        // ctx.refs.submitted.show();
        this.setLocation();
      }
    }.bind(this));
  },

  _sortRowsBy(cellDataKey) {
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
  },

  _renderHeader(label, cellDataKey) {
    return (
      <a onClick={this._sortRowsBy.bind(null, cellDataKey)} style={{cursor: 'pointer', color: '#00526c'}}>{label}</a>
    );
  },

  onRowClick(a, b, c) {
    // console.log(a, b, c);
    this.setState({
      focus: c,
    });
    this.refs.confirm.show();
  },

  dialogDismiss() {
    this.refs.confirm.dismiss();
  },

  dialogOkay() {
    this.refs.confirm.dismiss();
    this.refs.reconfirm.show();
  },

  dialogAccept() {
    this.refs.reconfirm.dismiss();
    const ctx = this;
    async function checkThenUpdate() {
      const userAccepted = await shiftApi.getUserAccepted(userID);
      if (!userAccepted.rows.length) {
        console.log('accept job ', ctx.state.focus[0]);
        await shiftStatusApi.markShiftAsAccepted(ctx.state.focus[0], userID);
        socket.emit('update', {facility: ctx.state.focus[1]});
      } else {
        ctx.refs.error.show();
      }
    }

    checkThenUpdate();
  },

  render() {
    // console.log(this.state);
    let sortDirArrow = '';

    if (this.state.sortDir !== null) {
      sortDirArrow = this.state.sortDir === SortTypes.DESC ? ' ↓' : ' ↑';
    }

    const customActions = [
      <FlatButton
        label='Cancel'
        secondary
        onTouchTap={this.dialogDismiss} />,
      <FlatButton
        label='Request for Approval'
        primary
        onTouchTap={this.dialogOkay} />,
    ];

    const reconfirmActions = [
      <FlatButton
        label='Cancel'
        secondary
        onTouchTap={this.dialogDismiss} />,
      <FlatButton
        label='Request for Approval'
        primary
        onTouchTap={this.dialogAccept} />,
    ];

    return (

      <div>
        <Dialog
          ref='confirm'
          title='Confirm Contract'
          actions={customActions}
          modal={this.state.modal}>
          Do you want to accept shift #<b>{this.state.focus[0] }</b> from <b>{this.state.focus[1] }</b>. The hospital will pay you <b>{this.state.focus[4] }</b> as an emplyee or <b>{this.state.focus[5] }</b> as an independent contractor.
          The shift starts at <b>{this.state.focus[9] }</b> at <b>{this.state.focus[10] }</b> in <b>{this.state.focus[3]}</b> and last for <b>{this.state.focus[2]}</b>.
          <br/>
          <br/>
          Failuare to show up without 2 hours notification before will adversely affect your chance of finding another job on this platform.
        </Dialog>
        <Dialog
          ref='reconfirm'
          title='Are you sure?'
          actions={reconfirmActions}
          modal={this.state.modal}>
          Are you sure you want to accept shift #<b>{this.state.focus[0] }</b> from <b>{this.state.focus[1] }</b>. The hospital will pay you <b>{this.state.focus[4] }</b> as an emplyee or <b>{this.state.focus[5] }</b> as an independent contractor.
          The shift starts at <b>{this.state.focus[9] }</b> at <b>{this.state.focus[10] }</b> in <b>{this.state.focus[3]}</b> and last for <b>{this.state.focus[2]}</b>.
          <br/>
          <br/>
          <b>Failuare to show up without 2 hours notification before will adversely affect your chance of finding another job on this platform.</b>
        </Dialog>
        <Snackbar
          ref='submitted'
          action='OK'
          message='Shift Added'
          autoHideDuration={1000}
          />
        <Snackbar
          ref='error'
          action='OK'
          message='ERROR! You may only queue for one shift a day.'
          autoHideDuration={10000}
          />
        <Table
          rowHeight={50}
          rowGetter={this.rowGetter}
          rowsCount={this.state.table.length}
          onRowClick={this.onRowClick}
          width={this.state.w}
          height={this.state.h}
          headerHeight={50}>
          <Column
            label={'Facility Name' + (this.state.sortBy === 2 ? sortDirArrow : '')}
            headerRenderer={this._renderHeader}
            width={150}
            allowCellsRecycling
            dataKey={2}
          />
          <Column
            label={'Duration' + (this.state.sortBy === 3 ? sortDirArrow : '')}
            headerRenderer={this._renderHeader}
            flexGrow={1}
            width={90}
            allowCellsRecycling
            dataKey={3}
          />
          <Column
            label={'Specialty' + (this.state.sortBy === 4 ? sortDirArrow : '')}
            headerRenderer={this._renderHeader}
            flexGrow={3}
            width={150}
            allowCellsRecycling
            dataKey={4}
          />
          <Column
            label={'Pay' + (this.state.sortBy === 5 ? sortDirArrow : '')}
            headerRenderer={this._renderHeader}
            flexGrow={1}
            width={100}
            allowCellsRecycling
            dataKey={5}
          />
          <Column
            label={'EMR' + (this.state.sortBy === 7 ? sortDirArrow : '')}
            headerRenderer={this._renderHeader}
            flexGrow={1}
            width={110}
            allowCellsRecycling
            dataKey={7}
          />
          <Column
            label={'Dress Code' + (this.state.sortBy === 8 ? sortDirArrow : '')}
            headerRenderer={this._renderHeader}
            flexGrow={1}
            width={120}
            allowCellsRecycling
            dataKey={8}
          />
          <Column
            label={'Miles' + (this.state.sortBy === 9 ? sortDirArrow : '')}
            headerRenderer={this._renderHeader}
            flexGrow={1}
            width={70}
            allowCellsRecycling
            dataKey={9}
          />
          <Column
            label={'Start Date' + (this.state.sortBy === 10 ? sortDirArrow : '')}
            headerRenderer={this._renderHeader}
            flexGrow={1}
            width={100}
            allowCellsRecycling
            dataKey={10}
          />
          <Column
            label={'Start Time' + (this.state.sortBy === 11 ? sortDirArrow : '')}
            headerRenderer={this._renderHeader}
            flexGrow={1}
            width={110}
            allowCellsRecycling
            dataKey={11}
          />
        </Table>
      </div>
    );
  },
});

export default ShiftHospitalTable;
