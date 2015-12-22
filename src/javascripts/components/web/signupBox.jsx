import React from 'react';
import { Card, TextField, CardActions, RaisedButton } from 'material-ui';
import request from 'superagent';
import validator from 'validator';
import setToken from '../../utils/setToken.js';

const SignupBox = React.createClass({
  getInitialState() {
    return {
      signupButton: 'Sign up',
    };
  },

  handleSubmit() {
    const ctx = this;
    if (validator.isEmail(this.refs.email.getValue()) &&
        this.refs.password.getValue().length > 5 &&
        this.refs.password.getValue() === this.refs.password2.getValue()) {
      this.setState({
        signupButton: 'Sending Data',
      });
      this.refs.email.setErrorText('');
      request
        .post('//api.unitednurseregistry.com/api/auth/signup')
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
            ctx.setState({
              signupButton: 'Success',
            });
            setToken(res.headers.authorization, res.body.message);
            window.location.assign('#app');
            // console.log(localStorage.getItem('token'));
          } else if (res.status === 406) {
            ctx.setState({
              signupButton: 'Sign up',
            });
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
      if (this.refs.password.getValue() !== this.refs.password2.getValue()) {
        this.refs.password.setErrorText('Password Must Match');
        this.refs.password2.setErrorText('Password Must Match');
      } else {
        this.refs.password2.setErrorText('');
        this.refs.password.setErrorText('');
      }
    }
    if (this.refs.password2.getValue().length === 0) {
      this.refs.password2.setErrorText('');
    } else if (this.refs.password2.getValue().length < 6) {
      this.refs.password2.setErrorText('Password have atleast 6 characters');
    } else {
      if (this.refs.password.getValue() !== this.refs.password2.getValue()) {
        this.refs.password.setErrorText('Password Must Match');
        this.refs.password2.setErrorText('Password Must Match');
      } else {
        this.refs.password2.setErrorText('');
        this.refs.password.setErrorText('');
      }
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
            onBlur={this.validateEmail}
            onEnterKeyDown={this.handleSubmit}
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
          <TextField
            floatingLabelText='Repeat Password'
            ref='password2'
            onEnterKeyDown={this.handleSubmit}
            onChange={this.validatePassword}
            hintText='Repeat Password'
            type='password'
          />
          <TextField
            floatingLabelText='Referral Email (optional)'
            ref='referral'
            onEnterKeyDown={this.handleSubmit}
            hintText='Referral Email (optional)'
            type='email'
          />
          <CardActions>
            <div className='signupButtonWrap'>
              <RaisedButton label={this.state.signupButton} onClick={this.handleSubmit} secondary/>
            </div>
          </CardActions>
        </div>
      </Card>
    );
  },
});

export default SignupBox;
