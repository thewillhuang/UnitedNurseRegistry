

import React from 'react';
import {TextField} from 'material-ui';
// const ThemeManager = new mui.Styles.ThemeManager();

class SpecialtyCard extends React.Component {
  // getChildContext() {
  //   return {
  //     muiTheme: ThemeManager.getCurrentTheme(),
  //   };
  // }

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
            floatingLabelText='Clinical Specialty Or Other skills'
            hintText='Clinical Specialty Or Other skills' />
          <br/>
          <TextField
            ref='specialtyExp'
            floatingLabelText='Years of Experience'
            hintText='Years of Experience' />
          <br/>
        </div>
      </div>
    );
  }
}

export default SpecialtyCard;
