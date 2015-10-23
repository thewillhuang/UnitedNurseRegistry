// TODO need to change dialog message
import React from 'react';
import mui, {FlatButton, Dialog} from 'material-ui';
import {Table, Column} from 'fixed-data-table';
import io from 'socket.io-client';
const ThemeManager = new mui.Styles.ThemeManager();
import userSpecialtyApi from '../../actions/webapi/userSpecialtyApi.js';
import shiftStatusApi from '../../actions/webapi/shiftStatusApi.js';
import user from '../../utils/grabUser.js';
import moment from 'moment';
const socket = io.connect();

class ShiftHospitalTable extends React.Component {
  state = {
    table: [
      ['data', 'data', 'data', 'data', 'data', 'data', 'data', 'data'],
    ],
    focus: ['data', 'data', 'data', 'data', 'data', 'data', 'data', 'data', 'data', 'data', 'data'],
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
        await shiftStatusApi.getPendingApprovalShift(user.scope.facilityID)
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
            const date = moment(newObj[i].date).format('YYYY-MM-DD');
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

    socket.on('connect', function() {
      console.log('table connected');
    });

    // console.log('about to run socket.on');
    socket.on('updated', function(data) {
      // console.log('hospital received a new shift :D ');
      console.log(data.facility, user.scope.facilityID);
      if (data.facility === user.scope.facilityID) {
        // console.log('called getSpecialtyID()');
        getSpecialtyID();
      }
    });

    getSpecialtyID();
  }

  onRowClick = (a, b, c) => {
    // console.log(a, b, c);
    this.setState({
      focus: c,
    });
    this.refs.comfirm.show();
  }

  dialogDismiss = () => {
    this.refs.comfirm.dismiss();
  }

  dialogOkay = () => {
    this.refs.comfirm.dismiss();
    this.refs.recomfirm.show();
  }

  dialogAccept = () => {
    this.refs.recomfirm.dismiss();
    const ctx = this;
    async function checkThenUpdate() {
      const setAsPending = await shiftStatusApi.markShiftAsPending(ctx.state.focus[0], ctx.state.focus[8], user.scope.facilityID);
      if (setAsPending.rows.affectedRows !== 0) {
        console.log('emit update shift');
        socket.emit('update', {facility: user.scope.facilityID});
      }
    }

    checkThenUpdate();
  }

  dialogAcceptPending = () => {

  }

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

    const reComfirmActions = [
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
          ref='comfirm'
          title='Comfirm Contract'
          actions={customActions}
          modal={this.state.modal}>
          Do you want to accept shift #<b>{this.state.focus[0] }</b> from <b>{this.state.focus[1] }</b>. The hospital will pay you <b>{this.state.focus[4] }</b> as an emplyee or <b>{this.state.focus[5] }</b> as an independent contractor.
          The shift starts at <b>{this.state.focus[9] }</b> at <b>{this.state.focus[10] }</b> in <b>{this.state.focus[3]}</b> and last for <b>{this.state.focus[2]}</b>.
          <br/>
          <br/>
          Failuare to show up without 2 hours notification before will adversely affect your chance of finding another job on this platform.
        </Dialog>
        <Dialog
          ref='recomfirm'
          title='Are you sure?'
          actions={reComfirmActions}
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
  }
}
export default ShiftHospitalTable;
