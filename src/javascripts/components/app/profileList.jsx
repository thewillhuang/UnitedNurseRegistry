'use strict';

import React from 'react';
import mui, {TextField, RadioButton, RadioButtonGroup} from 'material-ui';
import shiftActions from '../../actions/shiftActionCreators.js';
const ThemeManager = new mui.Styles.ThemeManager();
import shiftStore from '../../stores/shiftStore.js';
// const MenuItem = require('material-ui/lib/menus/menu-item');
// const MenuDivider = require('material-ui/lib/menus/menu-divider');
// import MediaQuery from 'react-responsive';

console.log(shiftStore);

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

  onAddressChange = (e, selected) => {
    if (selected === 'currentLocation') {
      shiftActions.loadCurrent();
      this.refs.address.setValue('');
    } else {
      shiftActions.loadAddress(this.refs.address.getValue());
    }
  }

  onPriceChange = (e, selected) => {
    if (selected === 'BestPaying') {
      shiftActions.sortByBestPaying();
    } else {
      shiftActions.sortByWorsePaying();
    }
  };

  selectAddress = () => {
    this.refs.searchAreaRadio.setSelectedValue('address');
  }

  loadAddress = () => {
    shiftActions.loadAddress(this.refs.address.getValue());
  }

  render() {
    return (
      <div>
        <RadioButtonGroup ref='searchAreaRadio' name='searchArea' onChange={this.onAddressChange} defaultSelected='currentLocation'>
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
          <RadioButtonGroup ref='sortyByPrice' name='sortPrice' onChange={this.onPriceChange} defaultSelected='BestPaying' >
            <RadioButton
              value='BestPaying'
              label='Best Paying First' />
            <RadioButton
              value='WorsePaying'
              label='Best Paying Last' />
          </RadioButtonGroup>
      </div>
    );
  }
}

export default ShiftFilter;
