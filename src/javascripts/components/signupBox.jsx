'use strict';

import React from 'react';
import mui, { Card, TextField, CardActions, RaisedButton } from 'material-ui';
import request from 'superagent';
import validator from 'validator';
const ThemeManager = new mui.Styles.ThemeManager();
// console.log(request);

class LoginBox extends React.Component {
  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  }

  handleSubmit = ()  => {
    if (validator.isEmail(this.refs.email.getValue()) && this.refs.password.getValue().length > 5) {
      this.refs.email.setErrorText('');
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
    } else {
      this.validatePassword();
      this.validateEmail();
    }
  }
  validatePassword = () => {
    if (this.refs.password.getValue().length === 0) {
      this.refs.password.setErrorText('');
    } else if (this.refs.password.getValue().length < 6) {
      this.refs.password.setErrorText('Password have atleast 6 characters');
    } else {
      this.refs.password.setErrorText('');
    }
  }
  validateEmail = () => {
    // console.log(this.refs.email.getValue());
    if (validator.isEmail(this.refs.email.getValue())) {
      this.refs.email.setErrorText('');
    } else if (this.refs.email.getValue().length === 0) {
      this.refs.email.setErrorText('');
    } else {
      this.refs.email.setErrorText('Invalid Email');
    }
  }

  render() {
    return (
      <Card>
        <div className='login-wrapper'>
          <TextField
            floatingLabelText='Email Address'
            ref='email'
            hintText='Email'
            onChange={this.validateEmail}
            type='email'
          />
          <TextField
            floatingLabelText='Password'
            ref='password'
            onEnterKeyDown={this.handleSubmit}
            onChange={this.validatePassword}
            hintText='Password'
            type='password'
          />
          <CardActions>
            <div className='signupButtonWrap'>
              <RaisedButton label='Sign Up' onClick={this.handleSubmit} secondary={true}/>
            </div>
          </CardActions>
        </div>
      </Card>
    );
  }
}

export default LoginBox;
