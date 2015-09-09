import React from 'react';
import mui, {TextField} from 'material-ui';
const ThemeManager = new mui.Styles.ThemeManager();
// const MenuItem = require('material-ui/lib/menus/menu-item');
// const MenuDivider = require('material-ui/lib/menus/menu-divider');
// import MediaQuery from 'react-responsive';

class ShiftHospitalTable extends React.Component {
  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  }

  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }

  render() {
    return (
      <div className='profileCardInputWrap'>
        <TextField
          ref='specialty'
          floatingLabelText='Shift Specialty'
          hintText='Shift Specialty' />
        <br/>
        <TextField
          ref='startHour'
          floatingLabelText='Shift Start Hour'
          hintText='Shift Start Hour' />
        <br/>
        <TextField
          ref='duration'
          floatingLabelText='Shift Duration'
          hintText='Shift Duration' />
        <br/>
        <TextField
          ref='payPerHour'
          floatingLabelText='Pay Per Hour'
          hintText='Pay Per Hour' />
        <br/>
        <TextField
          ref='date'
          floatingLabelText='Shift Date'
          hintText='Shift Date' />
      </div>
    );
  }
}

export default ShiftHospitalTable;
