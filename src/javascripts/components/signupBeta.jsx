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
    if (this.refs.email.getValue()) {
      request
        .post('/api/auth/signup')
        .send({
          email: this.refs.email.getValue(),
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
      this.refs.email.setErrorText('Must enter an email');
    }
  }

  validateEmail = () => {
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
      <div className='betasignup-wrapper'>
        <TextField
          floatingLabelText='Email Address'
          ref='email'
          hintText='Email'
          onChange={this.validateEmail}
          type='email'
          onEnterKeyDown={this.handleSubmit}
          style={{color: 'white'}}
        />
          <div className='signupbetabutton'>
            <RaisedButton label='Sign Up' onClick={this.handleSubmit} secondary={true}/>
          </div>
      </div>
    );
  }
}

export default SignupBox;
