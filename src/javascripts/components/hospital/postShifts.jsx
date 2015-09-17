import React from 'react';
import mui, {TextField, RaisedButton} from 'material-ui';
const ThemeManager = new mui.Styles.ThemeManager();
// const MenuItem = require('material-ui/lib/menus/menu-item');
// const MenuDivider = require('material-ui/lib/menus/menu-divider');
// import MediaQuery from 'react-responsive';
import shiftApi from '../../actions/webapi/shiftApi.js';
import specialtyApi from '../../actions/webapi/userSpecialtyApi.js';
import user from '../../utils/grabUser.js';

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
      this.refs.specialty.setErrorText('Must enter a specialty');
    } else if (this.refs.specialty.getValue().length <= 1) {
      this.refs.specialty.setErrorText('Must enter a specialty');
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
  }

  // TODO not done yet need to submit shift
  handleSubmit = () => {
    if (this.refs.specialty.getValue().length &&
        this.refs.startHour.getValue().length &&
        this.refs.duration.getValue().length &&
        this.refs.payPerHour.getValue().length &&
        this.refs.date.getValue().length) {
      console.log('send');
      specialtyApi.createSpecialty(this.refs.specialty.getValue())
      .then(res => {
        return res.specialtyID;
      }).then(specialtyID => {
        console.log(specialtyID);
      });
    } else {
      this.validateShift();
    }
  }

  render() {
    return (
      <div className='profileCardInputWrap'>
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
          hintText='Shift Start Hour' />
        <br/>
        <TextField
          ref='duration'
          onChange={this.validateShift}
          onEnterKeyDown={this.handleSubmit}
          floatingLabelText='Shift Duration'
          hintText='Shift Duration' />
        <br/>
        <TextField
          ref='payPerHour'
          onChange={this.validateShift}
          onEnterKeyDown={this.handleSubmit}
          floatingLabelText='Pay Per Hour'
          hintText='Pay Per Hour' />
        <br/>
        <TextField
          ref='date'
          onChange={this.validateShift}
          onEnterKeyDown={this.handleSubmit}
          floatingLabelText='Shift Date'
          hintText='Shift Date' />
        <RaisedButton label='submit' onClick={this.handleSubmit} secondary/>
      </div>
    );
  }
}

export default ShiftHospitalTable;
