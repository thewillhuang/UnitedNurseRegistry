import React from 'react';
import mui from 'material-ui';
import {Table, Column} from 'fixed-data-table';
import io from 'socket.io-client';
const ThemeManager = new mui.Styles.ThemeManager();
// import shiftApi from '../../actions/webapi/shiftApi.js';
import userSpecialtyApi from '../../actions/webapi/userSpecialtyApi.js';
import shiftStatusApi from '../../actions/webapi/shiftStatusApi.js';
// import shiftStatusApi from '../../actions/webapi/shiftStatusApi.js';
import user from '../../utils/grabUser.js';
import moment from 'moment';
// import Promise from 'bluebird';
const socket = io.connect();
// const MenuItem = require('material-ui/lib/menus/menu-item');
// const MenuDivider = require('material-ui/lib/menus/menu-divider');
// import MediaQuery from 'react-responsive';

class ShiftHospitalTable extends React.Component {
  state = {
    table: [
      ['data', 'data', 'data', 'data', 'data', 'data', 'data', 'data'],
    ],
  }

  rowGetter = (rowIndex) => {
    return this.state.table[rowIndex];
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  }

  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }

  componentDidMount() {
    const ctx = this;
    async function getTableRows() {
      // console.log('this', ctx);
      try {
        await shiftStatusApi.getCompletedShift(user.scope.facilityID)
        .then(res=> {
          return res.rows;
        }).then(rows => {
          console.log(rows);
          // get useful information shiftID, fk_Shift_specialtyID, status, Viewed %, Pay Per Hour, Unit, Date and Time, fk_Shift_userID
          return rows.map(obj => {
            // console.log('ctx', ctx.state, obj);
            const newObj = {};
            newObj.shiftID = obj.shiftID;
            newObj.specialtyID = obj.fk_Shift_specialtyID;
            newObj.unit = ctx.state.specialty[`${obj.fk_Shift_specialtyID}`];
            newObj.payPerHour = obj.payPerHour;
            newObj.shiftDuration = obj.shiftDuration;
            newObj.date = obj.date;
            newObj.shiftStartHour = obj.shiftStartHour;
            return newObj;
          });
        }).then(newObj => {
          // construct the table
          const table = [];
          for (let i = 0; i < newObj.length; i++) {
            const date = moment(newObj[i].date).format('YYYY-MM-DD');
            table.push([
              newObj[i].shiftID,
              'complete', `$ ${newObj[i].payPerHour}`,
              `${newObj[i].shiftDuration} hrs`,
              `$ ${newObj[i].payPerHour * newObj[i].shiftDuration}`,
              newObj[i].unit, date,
              `${newObj[i].shiftStartHour}`,
            ]);
          }
          return table.reverse();
        }).then(table => {
          ctx.setState({table: table});
        });
      } catch (e) {
        console.log('get table error', e);
      }
    }

    async function getSpecialtyID() {
      try {
        const specialtyArray = await userSpecialtyApi.getAllSpecialtyID();
        // console.log('specialtyArray', specialtyArray);
        const specialties = {};
        for (let i = 0; i < specialtyArray.rows.length; i++) {
          // console.log(specialtyArray.rows[i]);
          specialties[`${specialtyArray.rows[i].specialtyID}`] = specialtyArray.rows[i].specialty;
        }
        ctx.setState({specialty: specialties});
        // console.log('specialties', specialties);
        getTableRows();
      } catch (e) {
        console.log('specialty error', e);
      }
    }

    socket.on('connect', function() {
      console.log('table connected');
    });

    socket.on('updated', function(data) {
      console.log('server received a new shift');
      if (data.facility === user.scope.facilityID) {
        getSpecialtyID();
      }
    });

    getSpecialtyID();
  }

  _onRowSelection(array) {
    console.log(array);
  }

  render() {
    return (
      <div className='tableWrap'>
        <Table
          rowHeight={50}
          rowGetter={this.rowGetter}
          rowsCount={this.state.table.length}
          width={1050}
          height={500}
          headerHeight={50}>
          <Column
            label='Shift ID'
            width={110}
            dataKey={0}
          />
          <Column
            label='Status'
            width={100}
            dataKey={1}
          />
          <Column
            label='Pay Per Hour'
            flexGrow={1}
            width={160}
            dataKey={2}
          />
          <Column
            label='Duration'
            flexGrow={1}
            width={100}
            dataKey={3}
          />
          <Column
            label='Total Payment'
            flexGrow={1}
            width={120}
            dataKey={4}
          />
          <Column
            label='Unit'
            flexGrow={1}
            width={100}
            dataKey={5}
          />
          <Column
            label='Date'
            flexGrow={1}
            width={150}
            dataKey={6}
          />
          <Column
            label='Time'
            flexGrow={1}
            width={120}
            dataKey={7}
          />
        </Table>
      </div>
    );
  }
}
export default ShiftHospitalTable;
