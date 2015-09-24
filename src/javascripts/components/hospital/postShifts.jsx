import React from 'react';
import mui, {TextField, RaisedButton, Snackbar} from 'material-ui';
const ThemeManager = new mui.Styles.ThemeManager();
// const MenuItem = require('material-ui/lib/menus/menu-item');
// const MenuDivider = require('material-ui/lib/menus/menu-divider');
// import MediaQuery from 'react-responsive';
import shiftApi from '../../actions/webapi/shiftApi.js';
import specialtyApi from '../../actions/webapi/userSpecialtyApi.js';
import user from '../../utils/grabUser.js';
import io from 'socket.io-client';
import moment from 'moment';
import PayButton from './payButton.jsx';
const socket = io.connect();


console.log(shiftApi);
console.log(specialtyApi);
console.log(user);

class ShiftHospitalTable extends React.Component {
  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  }

  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }

  validateShift = () => {
    if (this.refs.specialty.getValue().length === 0) {
      this.refs.specialty.setErrorText('Must enter a specialty or Unit');
    } else if (this.refs.specialty.getValue().length <= 1) {
      this.refs.specialty.setErrorText('Must enter a specialty or Unit');
    } else {
      this.refs.specialty.setErrorText('');
    }
    if (this.refs.startHour.getValue().length === 0) {
      this.refs.startHour.setErrorText('Must enter a startHour');
    } else if (this.refs.startHour.getValue().length <= 1) {
      this.refs.startHour.setErrorText('Must enter a startHour');
    } else {
      this.refs.startHour.setErrorText('');
    }
    if (this.refs.duration.getValue().length === 0) {
      this.refs.duration.setErrorText('Must enter a duration');
    } else if (this.refs.duration.getValue().length <= 1) {
      this.refs.duration.setErrorText('Must enter a duration');
    } else {
      this.refs.duration.setErrorText('');
    }
    if (this.refs.payPerHour.getValue().length === 0) {
      this.refs.payPerHour.setErrorText('Must enter Pay');
    } else if (this.refs.duration.getValue().length <= 1) {
      this.refs.payPerHour.setErrorText('Must enter Pay');
    } else {
      this.refs.payPerHour.setErrorText('');
    }
    if (this.refs.date.getValue().length === 0) {
      this.refs.date.setErrorText('Must enter a Date');
    } else if (this.refs.date.getValue().length <= 1) {
      this.refs.date.setErrorText('Must enter a Date');
    } else {
      this.refs.date.setErrorText('');
    }
    if (this.refs.shiftDressCode.getValue().length === 0) {
      this.refs.shiftDressCode.setErrorText('Must enter a Dress Code');
    } else if (this.refs.shiftDressCode.getValue().length <= 1) {
      this.refs.shiftDressCode.setErrorText('Must enter a Dress Code');
    } else {
      this.refs.shiftDressCode.setErrorText('');
    }
  }

  // TODO not done yet need to submit shift
  handleSubmit = () => {
    const facilityID = user.scope.facilityID;
    const specialty = this.refs.specialty.getValue();
    const shiftStartHour = this.refs.startHour.getValue();
    const shiftDuration = this.refs.duration.getValue();
    const payPerHour = this.refs.payPerHour.getValue();
    const date = this.refs.date.getValue();
    const shiftDressCode = this.refs.shiftDressCode.getValue();
    const ctx = this;
    if (specialty.length &&
        shiftStartHour.length &&
        shiftDuration.length &&
        payPerHour.length &&
        shiftDressCode.length &&
        date.length) {
      // get specialty ID of the specialty
      specialtyApi.createSpecialty(this.refs.specialty.getValue())
      // then, store the shift with the specialtyID
      .then(res => {
        return shiftApi.createShift(facilityID, res.specialtyID, shiftStartHour, shiftDuration, payPerHour, date, shiftDressCode);
      }).then(()=> {
        // console.log(saved);
        ctx.refs.specialty.clearValue();
        // ctx.refs.startHour.clearValue();
        // ctx.refs.duration.clearValue();
        // ctx.refs.payPerHour.clearValue();
        // ctx.refs.date.clearValue();
        // ctx.refs.shiftDressCode.clearValue();
        ctx.refs.submitted.show();
        socket.emit('shift updated', {facility: user.scope.facilityID});
      });
    } else {
      this.validateShift();
    }
  }

  render() {
    return (
      <div className='profileCardInputWrap'>
        <Snackbar
          ref='submitted'
          action='OK'
          message='Shift Added'
          autoHideDuration={5000}
          />
        <TextField
          ref='specialty'
          onChange={this.validateShift}
          onEnterKeyDown={this.handleSubmit}
          floatingLabelText='Shift Specialty'
          hintText='Shift Specialty' />
        <br/>
        <TextField
          ref='startHour'
          onChange={this.validateShift}
          onEnterKeyDown={this.handleSubmit}
          floatingLabelText='Shift Start Hour'
          defaultValue='07'
          hintText='Shift Start Hour' />
        <br/>
        <TextField
          ref='duration'
          onChange={this.validateShift}
          onEnterKeyDown={this.handleSubmit}
          defaultValue='12'
          floatingLabelText='Shift Duration'
          hintText='Shift Duration' />
        <br/>
        <TextField
          ref='shiftDressCode'
          onChange={this.validateShift}
          onEnterKeyDown={this.handleSubmit}
          floatingLabelText='Dress Code'
          defaultValue='clean scrubs'
          hintText='Dress Code' />
        <br/>
        <TextField
          ref='payPerHour'
          onChange={this.validateShift}
          onEnterKeyDown={this.handleSubmit}
          floatingLabelText='Pay Per Hour'
          defaultValue='53'
          hintText='Pay Per Hour' />
        <br/>
        <TextField
          ref='date'
          onChange={this.validateShift}
          onEnterKeyDown={this.handleSubmit}
          floatingLabelText='Shift Date'
          defaultValue={moment().format('YYYY-MM-DD')}
          hintText='Shift Date' />
        <RaisedButton label='submit' onClick={this.handleSubmit} secondary/>
        <PayButton pay={1} />
      </div>
    );
  }
}

export default ShiftHospitalTable;
