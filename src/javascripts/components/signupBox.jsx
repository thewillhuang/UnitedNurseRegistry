'use strict';

import React from 'react';
import mui, { Card, TextField, CardActions, RaisedButton } from 'material-ui';
import request from 'superagent';
import validator from 'validator';
const ThemeManager = new mui.Styles.ThemeManager();
// console.log(request);

class SignupBox extends React.Component {
  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }
  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  }
  handleSubmit = ()  => {
    request
      .post('/api/auth/signup')
      .send({
        email: this.refs.email.getValue(),
        password: this.refs.password.getValue(),
      })
      .end(function(err, res) {
        console.log(err);
        console.log(res.body);
        console.log(res.headers);
        localStorage.setItem('token', res.headers.authorization);
        window.location.assign('/#/app');
        console.log(localStorage.getItem('token'));
      });
  }
  validate = () => {
    if (validator.isEmail(this.refs.email.getValue())) {
      this.refs.email.setErrorText('');
    } else {
      this.refs.email.setErrorText('invalid email');
    }
  }
  render() {
    return (
      <Card>
        <div className='signup-wrapper'>
          <TextField
            floatingLabelText='Email Address'
            ref='email'
            hintText='Email'
            onChange={this.validate}
            type='email'
          />
          <TextField floatingLabelText='Password' ref='password' onEnterKeyDown={this.handleSubmit} hintText='Password' type='password'/>
          <CardActions>
            <div className='signupbutton'>
              <RaisedButton label='Signup' onClick={this.handleSubmit} secondary={true}/>
            </div>
          </CardActions>
        </div>
      </Card>
    );
  }
}

export default SignupBox;
