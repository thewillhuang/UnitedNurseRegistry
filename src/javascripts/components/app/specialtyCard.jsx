'use strict';

import React from 'react';
import mui, {TextField} from 'material-ui';
const ThemeManager = new mui.Styles.ThemeManager();

class SpecialtyCard extends React.Component {
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
      <div className='card'>
        <div className='cardTitle'>
          Specialty
        </div>
        <hr className='cardDivider' />
        <div className='cardBody'>
          <TextField
            ref='specialty'
            floatingLabelText='Clinical Specialty'
            hintText='Clinical Specialty' />
          <br/>
          <TextField
            ref='specialtyExp'
            floatingLabelText='Years of Experience'
            hintText='Years of Experience' />
          <br/>
          <TextField
            ref='licenseExp'
            floatingLabelText='License Expiration Date'
            hintText='License Expiration Date' />
          <br/>
        </div>
      </div>
    );
  }
}

export default SpecialtyCard;
