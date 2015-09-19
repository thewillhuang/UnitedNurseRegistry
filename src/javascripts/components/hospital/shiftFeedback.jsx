import React from 'react';
import mui from 'material-ui';
import {Table, Column} from 'fixed-data-table';
import io from 'socket.io-client';
const ThemeManager = new mui.Styles.ThemeManager();
import shiftApi from '../../actions/webapi/shiftApi.js';
import userSpecialtyApi from '../../actions/webapi/userSpecialtyApi.js';
import user from '../../utils/grabUser.js';
import moment from 'moment';
const socket = io.connect();
// const MenuItem = require('material-ui/lib/menus/menu-item');
// const MenuDivider = require('material-ui/lib/menus/menu-divider');
// import MediaQuery from 'react-responsive';

class ShiftHospitalTable extends React.Component {
  state = {
    table: [],
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
        await shiftApi.getActiveHospitalShift(user.scope.facilityID)
        .then(res=> {
          return res.rows;
        }).then(rows => {
          // console.log(rows);
          // get useful information shiftID, fk_Shift_specialtyID, status, Viewed %, Pay Per Hour, Unit, Date and Time, fk_Shift_userID
          return rows.map(obj => {
            // console.log('ctx', ctx.state, obj);
            const newObj = {};
            newObj.shiftID = obj.shiftID;
            newObj.specialtyID = obj.fk_Shift_specialtyID;
            newObj.unit = ctx.state.specialty[`${obj.fk_Shift_specialtyID}`];
            if (obj.open === 1) {
              newObj.status = 'open';
            } else {
              newObj.status = 'pending';
            }
            newObj.payPerHour = obj.payPerHour;
            newObj.shiftDressCode = obj.shiftDressCode;
            newObj.shiftDuration = obj.shiftDuration;
            newObj.date = obj.date;
            newObj.shiftStartHour = obj.shiftStartHour;
            return newObj;
          });
        }).then(newObj => {
          // construct the table
          const table = [];
          for (let i = 0; i < newObj.length; i++) {
            const date = moment(newObj[i].date).format('MM-DD-YYYY');
            table.push([newObj[i].status, newObj[i].payPerHour, newObj[i].unit, date, newObj[i].shiftStartHour]);
          }
          // console.log('new object', newObj);
          ctx.setState({table: table});
        });
      } catch (e) {
        console.log(e);
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
        console.log('async await error', e);
      }
    }

    socket.on('connect', function() {
      console.log('table connected');
    });

    socket.on('update shift', function() {
      console.log('server received a new shift');
      getTableRows();
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
          width={700}
          height={500}
          headerHeight={50}>
          <Column
            label='Status'
            width={100}
            dataKey={0}
          />
          <Column
            label='Viewed %'
            width={100}
            dataKey={1}
          />
          <Column
            label='Pay Per Hour'
            flexGrow={1}
            width={100}
            dataKey={2}
          />
          <Column
            label='Unit'
            flexGrow={1}
            width={100}
            dataKey={3}
          />
          <Column
            label='Date and Time'
            flexGrow={1}
            width={150}
            dataKey={4}
          />
        </Table>
      </div>
    );
  }
}
export default ShiftHospitalTable;
