// TODO need to change dialog message
import React from 'react';
import {FlatButton, Dialog} from 'material-ui';
import {Table, Column} from 'fixed-data-table';
import io from 'socket.io-client';
import userSpecialtyApi from '../../webapi/userSpecialtyApi.js';
import shiftStatusApi from '../../webapi/shiftStatusApi.js';
import user from '../../utils/grabUser.js';
const facilityID = user.scope.facilityID;
const socket = io.connect();
import checkoutApi from '../../webapi/checkout.js';

const ShiftHospitalTable = React.createClass({
  getInitialState: function () {
    return {
      table: [
        ['data', 'data', 'data', 'data', 'data', 'data', 'data', 'data'],
      ],
      focus: ['data', 'data', 'data', 'data', 'data', 'data', 'data', 'data', 'data', 'data', 'data'],
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
        await shiftStatusApi.getPendingApprovalShift(facilityID)
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
            newObj.payPerHour = obj.payPerHour;
            newObj.shiftDuration = obj.shiftDuration;
            newObj.date = obj.date;
            newObj.userID = obj.fk_Shift_userID;
            newObj.shiftStartHour = obj.shiftStartHour;
            return newObj;
          });
        }).then(newObj => {
          // construct the table
          const table = [];
          for (let i = 0; i < newObj.length; i++) {
            // const date = moment(newObj[i].date).format('YYYY-MM-DD');
            const date = newObj[i].date.split('T')[0];
            table.push([newObj[i].shiftID, 'pending', `$ ${newObj[i].payPerHour}`, `${newObj[i].shiftDuration} hrs`, `$ ${newObj[i].payPerHour * newObj[i].shiftDuration}`, newObj[i].unit, date, `${newObj[i].shiftStartHour}`, newObj[i].userID]);
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

    socket.on('connect', function () {
      console.log('table connected');
    });

    // console.log('about to run socket.on');
    socket.on('updated', function (data) {
      // console.log('hospital received a new shift :D ');
      console.log(data.facility, facilityID);
      if (data.facility === facilityID) {
        // console.log('called getSpecialtyID()');
        getSpecialtyID();
      }
    });

    getSpecialtyID();
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

  createToken() {
    const ctx = this;
    // console.log(ctx.state.focus[0]);
    const handler = window.StripeCheckout.configure({
      key: 'pk_test_pUdeTIh8WRLykG3RSugGr5yg',
      locale: 'auto',
      token: async function (token) {
        // console.log('amount', parseInt(ctx.state.focus[4], 10) * 100);
        console.log('amount', parseInt(ctx.state.focus[4].split(' ')[1], 10));
        await checkoutApi.saveCharges(token, ctx.state.focus[0], parseInt(ctx.state.focus[4].split(' ')[1], 10) * 100);
        await ctx.setAsPending();
      },
    });

    handler.open({
      name: 'test',
      description: '2 widgets',
      amount: parseInt(ctx.state.focus[4].split(' ')[1], 10) * 100,
    });
  },

  setAsPending() {
    const ctx = this;
    async function set() {
      const setState = await shiftStatusApi.markShiftAsPending(ctx.state.focus[0], ctx.state.focus[8], facilityID);
      if (setState.rows.affectedRows !== 0) {
        console.log('emit update shift');
        socket.emit('update', {facility: user.scope.facilityID});
      }
    }
    set();
  },

  dialogAccept() {
    this.refs.reconfirm.dismiss();
    this.createToken();
  },

  render() {
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
      <div className='tableWrap'>
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
        <Table
          rowHeight={50}
          rowGetter={this.rowGetter}
          rowsCount={this.state.table.length}
          onRowClick={this.onRowClick}
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
          <Column
            label='User Id'
            flexGrow={1}
            width={90}
            dataKey={8}
          />
        </Table>
      </div>
    );
  },
});

export default ShiftHospitalTable;
