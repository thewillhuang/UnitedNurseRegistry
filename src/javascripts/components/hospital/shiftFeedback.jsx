import React from 'react';
import {Table, Column} from 'fixed-data-table';
import io from 'socket.io-client';
import shiftApi from '../../webapi/shiftApi.js';
import userSpecialtyApi from '../../webapi/userSpecialtyApi.js';
import user from '../../utils/grabUser.js';
import moment from 'moment';
const socket = io.connect();
const facilityID = user.scope.facilityID;
// console.log(facilityID);
const ShiftHospitalTable = React.createClass({

  getInitialState: function() {
    return {
      table: [
        ['data', 'data', 'data', 'data', 'data', 'data', 'data'],
      ],
    };
  },

  rowGetter(rowIndex) {
    return this.state.table[rowIndex];
  },

  componentDidMount() {
    const ctx = this;
    async function getTableRows() {
      // console.log('this', ctx);
      try {
        console.log(facilityID);
        await shiftApi.getOpenHospitalShift(facilityID)
        .then(res=> {
          return res.rows;
        }).then(rows => {
          console.log(rows);
          // get useful information shiftID, fk_Shift_specialtyID, status, Viewed %, Pay Per Hour, Unit, Date and Time, fk_Shift_userID
          return rows.map(obj => {
            console.log('ctx', ctx.state, obj);
            const newObj = {};
            newObj.shiftID = obj.shiftID;
            newObj.specialtyID = obj.fk_Shift_specialtyID;
            newObj.unit = ctx.state.specialty[`${obj.fk_Shift_specialtyID}`];
            if (obj.open === 1) {
              newObj.status = 'Open';
            } else {
              newObj.status = 'Pending';
            }
            newObj.payPerHour = obj.payPerHour;
            newObj.shiftDuration = obj.shiftDuration;
            newObj.date = obj.date;
            newObj.shiftStartHour = obj.shiftStartHour;
            return newObj;
          });
        }).then(newObj => {
          // construct the table
          const table = [];
          const today = moment().format('YYYY-MM-DD');
          for (let i = 0; i < newObj.length; i++) {
            console.log('table object', newObj);
            // const date = moment(newObj[i].date, moment.ISO_8601).format('YYYY-MM-DD');
            const date = newObj[i].date.split('T')[0];
            console.log('date', date, 'today', today, 'id', newObj[i].shiftID);
            if (date >= today) {
              table.push([newObj[i].shiftID, newObj[i].status, '...', `$ ${newObj[i].payPerHour}`, `${newObj[i].shiftDuration} hrs`, `$ ${newObj[i].payPerHour * newObj[i].shiftDuration}`, newObj[i].unit.toUpperCase(), date, `${newObj[i].shiftStartHour}`]);
            }
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
      if (data.facility === facilityID) {
        getSpecialtyID();
      }
    });

    getSpecialtyID();
  },

  _onRowSelection(array) {
    console.log(array);
  },

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
            label='ID'
            width={70}
            dataKey={0}
          />
          <Column
            label='Status'
            width={80}
            dataKey={1}
          />
          <Column
            label='Viewed %'
            width={80}
            dataKey={2}
            flexGrow={1}
          />
          <Column
            label='Pay Per Hour'
            flexGrow={1}
            width={80}
            dataKey={3}
          />
          <Column
            label='Duration'
            flexGrow={1}
            width={80}
            dataKey={4}
          />
          <Column
            label='Total Payment'
            flexGrow={1}
            width={120}
            dataKey={5}
          />
          <Column
            label='Unit'
            flexGrow={1}
            width={100}
            dataKey={6}
          />
          <Column
            label='Date'
            flexGrow={1}
            width={150}
            dataKey={7}
          />
          <Column
            label='Time'
            flexGrow={1}
            width={70}
            dataKey={8}
          />
        </Table>
      </div>
    );
  },
});

export default ShiftHospitalTable;
