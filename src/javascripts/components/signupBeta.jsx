'use strict';

import React from 'react';
import mui, { Card, TextField, CardActions, RaisedButton } from 'material-ui';
import request from 'superagent';
import validator from 'validator';
const ThemeManager = new mui.Styles.ThemeManager();
// console.log(request);

class BetaSignup extends React.Component {
  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }

  state = {
    signupButton: 'Signup',
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  }

  handleSubmit = ()  => {
    const ctx = this;
    if (validator.isEmail(this.refs.email.getValue())) {
      this.refs.email.setErrorText('');
      this.setState({
        signupButton: 'Sending Data...',
      });
      request
        .post('/api/auth/beta/signup')
        .send({
          email: this.refs.email.getValue(),
        })
        .end(function(err, res) {
          console.log(err);
          // console.log(res.body);
          // console.log(res.headers);
          // console.log(res.status);
          if (res.status === 200) {
            this.setState({
              signupButton: 'Success',
            });
            localStorage.setItem('token', res.headers.authorization);
            window.location.assign('/#/app');
            // console.log(localStorage.getItem('token'));
          } else if (res.status === 406) {
            console.log('406 block', res.body.message);
            this.setState({
              signupButton: 'Retry',
            });
            if (res.body.message === 'email taken' || res.body.message === 'incorrect email') {
              // console.log('email block');
              ctx.refs.email.focus();
              ctx.refs.email.setErrorText(res.body.message);
            }
          }
        });
    } else {
      this.validateEmail();
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
      <h3 style={{color: 'white'}}>
        Sign up for Beta Launch
      </h3>
        <Card style={{paddingTop: 30}}>
          <TextField
            floatingLabelText='Email Address'
            ref='email'
            hintText='Email'
            onBlur={this.validateEmail}
            type='email'
            onEnterKeyDown={this.handleSubmit}
          />
          <CardActions>
            <div className='signupbutton'>
              <RaisedButton label={this.state.signupButton} onClick={this.handleSubmit} secondary={true}/>
            </div>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default BetaSignup;
