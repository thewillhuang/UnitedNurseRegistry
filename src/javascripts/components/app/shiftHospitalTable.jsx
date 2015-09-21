import React from 'react';
import mui from 'material-ui';
const ThemeManager = new mui.Styles.ThemeManager();
import {Table, Column} from 'fixed-data-table';
import getGeoHash from '../../utils/getGeoHash.js';
import shiftApi from '../../actions/webapi/shiftApi.js';
import io from 'socket.io-client';
const socket = io.connect();
import _ from 'lodash';
import moment from 'moment';

class ShiftHospitalTable extends React.Component {
  state = {
    table: [
      ['data', 'data', 'data', 'data', 'data', 'data', 'data', 'data', 'data', 'data'],
    ],
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
        // use geo hash to grab search results
        const data = await shiftApi.getShiftWithGeoHash(geoHash.geoHash, geoHash.geoHashSet, 3);
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
          table.push([
            el.shiftID,
            el.facilityName,
            el.payPerHour,
            el.specialty,
            el.facilityEMR,
            el.shiftDressCode,
            el.specialty,
            el.facilityGeohash,
            moment(el.date).format('YYYY-MM-DD'),
            el.shiftStartHour,
          ]);
        }
        ctx.setState({
          table: table,
        });
      } catch (e) {
        console.log(e);
      }
    }

    socket.on('connect', function() {
      console.log('table connected');
    });

    socket.on('update shift', function(data) {
      console.log('server received a new shift');
      if (_.includes(ctx.state.facilityIDs, data.facility)) {
        search();
      }
    });

    search();
  }

  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <Table
          rowHeight={50}
          rowGetter={this.rowGetter}
          rowsCount={this.state.table.length}
          width={1090}
          height={500}
          headerHeight={50}>
          <Column
            label='Shift ID'
            width={70}
            dataKey={0}
          />
          <Column
            label='Facility Name'
            width={100}
            dataKey={1}
          />
          <Column
            label='Pay Per Hour'
            width={80}
            dataKey={2}
            flexGrow={1}
          />
          <Column
            label='Specialty'
            flexGrow={1}
            width={80}
            dataKey={3}
          />
          <Column
            label='EMR'
            flexGrow={1}
            width={100}
            dataKey={4}
          />
          <Column
            label='Dress Code'
            flexGrow={1}
            width={120}
            dataKey={5}
          />
          <Column
            label='Specialty'
            flexGrow={1}
            width={70}
            dataKey={6}
          />
          <Column
            label='Location'
            flexGrow={1}
            width={70}
            dataKey={7}
          />
          <Column
            label='Start Date'
            flexGrow={1}
            width={70}
            dataKey={8}
          />
          <Column
            label='Start Time'
            flexGrow={1}
            width={70}
            dataKey={9}
          />
        </Table>
      </div>
    );
  }
}

export default ShiftHospitalTable;
