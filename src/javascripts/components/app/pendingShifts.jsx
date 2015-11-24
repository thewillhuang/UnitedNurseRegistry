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

const SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};

const ShiftHospitalTable = React.createClass({

  getInitialState: function() {
    return {
      table: [
        ['data', 'data', 'data', 'data', 'data', 'data', 'data', 'data', 'data', 'data', 'data'],
      ],
      sortBy: 0,
      sortDir: null,
      focus: ['data', 'data', 'data', 'data', 'data', 'data', 'data', 'data', 'data', 'data', 'data'],
    };
  },

  rowGetter(rowIndex) {
    return this.state.table[rowIndex];
  },

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

        console.log('getUserAccepted called');
        const data = await shiftApi.getUserAccepted(userID);

        console.log(data);

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
        const today = moment().subtract(12, 'hours').format('YYYY-MM-DD');
        for (let i = 0; i < rows.length; i++) {
          const el = rows[i];
          console.log(el);
          let latlng = '';
          let lat = '';
          let lng = '';
          let distKm = '';
          let distMi = 0;
          let total = '';
          if (el.facilityGeohash) {
            latlng = ghash.decode(el.facilityGeohash);
            lat = latlng.latitude;
            lng = latlng.longitude;
            distKm = geolib.getDistance(
              {latitude: lat, longitude: lng},
              {latitude: ctx.state.lat, longitude: ctx.state.lng}
            );
            distMi = distKm / 1000 * 0.621371;
            total = el.payPerHour * el.shiftDuration;
          }
          // const date = moment(el.date).format('YYYY-MM-DD');
          const date = el.date.split('T')[0];
          console.log(date, today);
          if (date >= today) {
            console.log('today passed');
            table.push([
              el.shiftID,
              el.facilityID,
              el.facilityName,
              // el.payPerHour,
              el.shiftDuration + ' hrs',
              el.specialty,
              '$ ' + calcW2(total),
              '$ ' + calcIc(total),
              el.facilityEMR,
              el.shiftDressCode,
              distMi.toFixed(2),
              date,
              el.shiftStartHour,
              moment(el.shift_modified).format('YYYY-MM-DD, h:mm a'),
            ]);
            console.log(ctx.state.lat, ctx.state.lng, lat, lng, distKm, distMi);
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

    socket.on('updated', function(data) {
      console.log('server received a new shift regarding facility', data.facility);
      // console.log(ctx, this);
      if (_.includes(ctx.state.facilityIDs, data.facility)) {
        // ctx.refs.submitted.show();
        search();
      }
    });

    search();
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
    console.log(a, b, c);
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
    console.log('dialogAccept called');
    this.refs.reconfirm.dismiss();
    const ctx = this;
    async function checkThenUpdate() {
      const userAccepted = await shiftApi.getUserAccepted(userID);
      console.log(userAccepted);
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
          title='confirm Contract'
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
            dataKey={2}
          />
          <Column
            label={'Duration' + (this.state.sortBy === 2 ? sortDirArrow : '')}
            headerRenderer={this._renderHeader}
            flexGrow={1}
            width={100}
            allowCellsRecycling
            dataKey={3}
          />
          <Column
            label={'Specialty' + (this.state.sortBy === 3 ? sortDirArrow : '')}
            headerRenderer={this._renderHeader}
            flexGrow={1}
            width={100}
            allowCellsRecycling
            dataKey={4}
          />
          <Column
            label={'Pay As Employee' + (this.state.sortBy === 4 ? sortDirArrow : '')}
            headerRenderer={this._renderHeader}
            flexGrow={1}
            width={150}
            allowCellsRecycling
            dataKey={5}
          />
          <Column
            label={'Pay As IC' + (this.state.sortBy === 5 ? sortDirArrow : '')}
            headerRenderer={this._renderHeader}
            flexGrow={1}
            width={100}
            allowCellsRecycling
            dataKey={6}
          />
          <Column
            label={'EMR' + (this.state.sortBy === 6 ? sortDirArrow : '')}
            headerRenderer={this._renderHeader}
            flexGrow={1}
            width={110}
            allowCellsRecycling
            dataKey={7}
          />
          <Column
            label={'Dress Code' + (this.state.sortBy === 7 ? sortDirArrow : '')}
            headerRenderer={this._renderHeader}
            flexGrow={1}
            width={120}
            allowCellsRecycling
            dataKey={8}
          />
          <Column
            label={'Miles' + (this.state.sortBy === 8 ? sortDirArrow : '')}
            headerRenderer={this._renderHeader}
            flexGrow={1}
            width={70}
            allowCellsRecycling
            dataKey={9}
          />
          <Column
            label={'Start Date' + (this.state.sortBy === 9 ? sortDirArrow : '')}
            headerRenderer={this._renderHeader}
            flexGrow={1}
            width={100}
            allowCellsRecycling
            dataKey={10}
          />
          <Column
            label={'Start Time' + (this.state.sortBy === 10 ? sortDirArrow : '')}
            headerRenderer={this._renderHeader}
            flexGrow={1}
            width={110}
            allowCellsRecycling
            dataKey={11}
          />
          <Column
            label={'Modified' + (this.state.sortBy === 11 ? sortDirArrow : '')}
            headerRenderer={this._renderHeader}
            flexGrow={2}
            width={120}
            allowCellsRecycling
            dataKey={12}
          />
        </Table>
      </div>
    );
  },
});

export default ShiftHospitalTable;
