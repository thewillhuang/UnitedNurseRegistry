import React from 'react';
import {TextField, RaisedButton} from 'material-ui';
// const ThemeManager = new mui.Styles.ThemeManager();

const input = {
  cursor: 'pointer',
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  width: '100%',
  opacity: 0,
};

class LicenseCard extends React.Component {
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
          License
        </div>
        <hr className='cardDivider' />
        <div className='cardBody'>
          <TextField
            ref='licenseNumber'
            floatingLabelText='License Number'
            hintText='License Number' />
          <br/>
          <TextField
            ref='licenseState'
            floatingLabelText='License State'
            hintText='License State' />
          <br/>
          <TextField
            ref='licenseExp'
            floatingLabelText='License Expiration Date'
            hintText='License Expiration Date' />
          <br/>
          <RaisedButton primary={true} label='Choose an Image'>
            <input type='file' style={input}></input>
          </RaisedButton>
        </div>
      </div>
    );
  }
}

export default LicenseCard;
