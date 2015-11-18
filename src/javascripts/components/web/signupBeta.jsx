import React from 'react';
import { Card, TextField, CardActions, RaisedButton, Snackbar } from 'material-ui';
import request from 'superagent';
import validator from 'validator';

const BetaSignup = React.createClass({

  getInitialState: function() {
    return {
      signupButton: 'Sign up',
    };
  },

  handleSubmit() {
    const ctx = this;
    if (validator.isEmail(this.refs.email.getValue())) {
      this.refs.email.setErrorText('');
      this.setState({
        signupButton: 'Sending Data...',
      });
      request
        .post('/api/beta/signup')
        .send({
          email: this.refs.email.getValue(),
        })
        .end(function(err, res) {
          if (res.status === 200) {
            ctx.setState({
              signupButton: 'Success',
            });
            ctx.refs.success.show();
            ctx.refs.email.setValue('');
          } else if (res.status === 406) {
            console.log('406 block', res.body.message);
            ctx.setState({
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
  },

  validateEmail() {
    if (validator.isEmail(this.refs.email.getValue())) {
      this.refs.email.setErrorText('');
    } else if (this.refs.email.getValue().length === 0) {
      this.refs.email.setErrorText('');
    } else {
      this.refs.email.setErrorText('Invalid Email');
    }
  },

  handleDismiss() {
    this.refs.success.dismiss();
  },

  componentDidMount() {
    this.refs.email.focus();
  },

  render() {
    return (
      <div className='betasignup-wrapper'>
      <Snackbar
        ref='success'
        action='Dismiss'
        onActionTouchTap={this.handleDismiss}
        message='We received your email, thank you for your interest'
        autoHideDuration={5000} />
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
              <RaisedButton label={this.state.signupButton} onClick={this.handleSubmit} secondary/>
            </div>
          </CardActions>
        </Card>
      </div>
    );
  },
});

export default BetaSignup;
