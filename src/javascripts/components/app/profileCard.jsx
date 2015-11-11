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

export default class ProfileCard extends React.Component {
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
          Profile
        </div>
        <hr className='cardDivider' />
        <div className='cardBody'>
          <div className='profileCardInputWrap'>

            <TextField
              ref='fName'
              floatingLabelText='First Name'
              hintText='First Name' />
            <br/>
            <TextField
              ref='mName'
              floatingLabelText='Middle Name'
              hintText='Middle Name' />
            <br/>
            <TextField
              ref='lName'
              floatingLabelText='Last Name'
              hintText='Last Name' />
            <br/>
            <TextField
              ref='dob'
              floatingLabelText='Date of Birth'
              hintText='Date of Birth' />
            <br/>
            <TextField
              ref='phone'
              floatingLabelText='Phone Number'
              hintText='Phone Number' />
            <br/>
            <TextField
              ref='ssn'
              floatingLabelText='Social Security Number'
              hintText='Social Security Number' />
            <br/>
            <TextField
              ref='address'
              floatingLabelText='Address'
              hintText='Address' />
            <br/>
            <TextField
              ref='city'
              floatingLabelText='City'
              hintText='City' />
            <br/>
            <TextField
              ref='state'
              floatingLabelText='State'
              hintText='State' />
            <br/>
            <TextField
              ref='zip'
              floatingLabelText='Zip'
              hintText='Zip' />
            <br/>
            <a href='/api/auth/stripe' className='stripe-connect'><span>Connect with Stripe</span></a>
            <br/>
            <RaisedButton primary label='Choose an Image'>
              <input type='file' style={input}></input>
            </RaisedButton>

          </div>
        </div>
      </div>
    );
  }
}
