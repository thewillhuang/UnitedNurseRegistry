'use strict';

import React from 'react';
import mui, {TextField, RadioButton, RadioButtonGroup} from 'material-ui';
import shiftActions from '../../actions/shiftActionCreators.js';
const ThemeManager = new mui.Styles.ThemeManager();
// const MenuItem = require('material-ui/lib/menus/menu-item');
// const MenuDivider = require('material-ui/lib/menus/menu-divider');
// import MediaQuery from 'react-responsive';

class ShiftFilter extends React.Component {
  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  }

  componentDidMount() {
    shiftActions.loadCurrent();
  }

  _onAddressChange = (e, selected) => {
    console.log('selected', selected);
    if (selected === 'currentLocation') {
      shiftActions.loadCurrent();
    } else {
      shiftActions.loadAddress(this.refs.address.getValue());
    }
  }

  selectAddress = () => {
    this.refs.searchAreaRadio.setSelectedValue('address');
  }

  loadAddress = () => {
    shiftActions.loadAddress(this.refs.address.getValue());
  }

  render() {
    return (
      <div>
        <RadioButtonGroup ref='searchAreaRadio' name='searchArea' onChange={this._onAddressChange} defaultSelected='currentLocation'>
          <RadioButton
            value='currentLocation'
            label='Use Current Location' />
          <RadioButton
            value='address'
            label='Use Address' />
          </RadioButtonGroup>
          <TextField
            ref='address'
            onFocus={this.selectAddress}
            hintText='Enter Address or Zip'
            onEnterKeyDown={this.loadAddress}
            floatingLabelText='Address' />
      </div>
    );
  }
}

export default ShiftFilter;
