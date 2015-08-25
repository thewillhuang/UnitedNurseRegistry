'use strict';

import React from 'react';
import mui, { Card, TextField, CardActions, RaisedButton } from 'material-ui';
const ThemeManager = new mui.Styles.ThemeManager();

class SignupBox extends React.Component {
  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }
  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  }
  render() {
    return (
      <Card>
        <div className='signup-wrapper'>
          <TextField floatingLabelText='Email Address' hintText='Email'/>
          <TextField floatingLabelText='Password' hintText='Password' type='password'/>
          <CardActions>
            <div className='signupbutton'>
              <RaisedButton label='Signup' secondary={true}/>
            </div>
          </CardActions>
        </div>
      </Card>
    );
  }
}

export default SignupBox;
