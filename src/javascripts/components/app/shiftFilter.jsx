'use strict';

import React from 'react';
import mui, {TextField, RaisedButton, Checkbox} from 'material-ui';
const ThemeManager = new mui.Styles.ThemeManager();
// const MenuItem = require('material-ui/lib/menus/menu-item');
// const MenuDivider = require('material-ui/lib/menus/menu-divider');
// import MediaQuery from 'react-responsive';

class ShiftFilter extends React.Component {
  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }

  static propTypes = {
    getLocation: React.PropTypes.func.isRequired,
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  }

  render() {
    return (
      <div>
        <RaisedButton
          label='Use Current Location'
          onClick={this.props.getLocation}
          secondary={true} />
        <TextField
          hintText='Address'
          floatingLabelText='Enter Address or Zip' />
        <Checkbox
          name='checkboxName1'
          value='checkboxValue1'
          label='went for a run today'/>
      </div>
    );
  }
}

export default ShiftFilter;
