import React from 'react';
import { Card, TextField, CardActions, RaisedButton } from 'material-ui';
import request from 'superagent';
import validator from 'validator';
import setToken from '../../utils/setToken.js';

const LoginBox = React.createClass({

  handleSubmit() {
    const ctx = this;
    if (validator.isEmail(this.refs.email.getValue()) && this.refs.password.getValue().length > 5) {
      this.refs.email.setErrorText('');
      request
        .post('//api.unitednurseregistry.com/api/auth/facility/login')
        .send({
          email: this.refs.email.getValue(),
          password: this.refs.password.getValue(),
        })
        .end(function (err, res) {
          // console.log(err);
          // console.log(res.body);
          // console.log(res.headers);
          // console.log(res.status);
          if (res.status === 200) {
            // console.log('headers', res.headers);
            // console.log(res.body.authorization, res.body.message.scope);
            setToken(res.body.authorization, res.body.message);
            window.location.assign('#hospital');
            // console.log(localStorage.getItem('token'));
          } else if (res.status === 406) {
            // console.log('406 block', res.body.message);
            if (res.body.message === 'email taken' || res.body.message === 'incorrect email') {
              // console.log('email block');
              ctx.refs.email.focus();
              ctx.refs.email.setErrorText(res.body.message);
            } else if (res.body.message === 'incorrect password') {
              // console.log('incorrect password block');
              ctx.refs.password.focus();
              ctx.refs.password.setErrorText(res.body.message);
            }
          }
        });
    } else {
      this.validatePassword();
      this.validateEmail();
    }
  },

  validatePassword() {
    if (this.refs.password.getValue().length === 0) {
      this.refs.password.setErrorText('');
    } else if (this.refs.password.getValue().length < 6) {
      this.refs.password.setErrorText('Password have atleast 6 characters');
    } else {
      this.refs.password.setErrorText('');
    }
  },

  validateEmail() {
    // console.log(this.refs.email.getValue());
    if (validator.isEmail(this.refs.email.getValue())) {
      this.refs.email.setErrorText('');
    } else if (this.refs.email.getValue().length === 0) {
      this.refs.email.setErrorText('');
    } else {
      this.refs.email.setErrorText('Invalid Email');
    }
  },

  componentDidMount() {
    this.refs.email.focus();
  },

  render() {
    return (
      <Card>
        <div className='login-wrapper'>
          <TextField
            floatingLabelText='Email Address'
            ref='email'
            hintText='Email'
            onEnterKeyDown={this.handleSubmit}
            onBlur={this.validateEmail}
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
              <RaisedButton label='Sign Up' onClick={this.handleSubmit} secondary/>
            </div>
          </CardActions>
        </div>
      </Card>
    );
  },
});

export default LoginBox;
