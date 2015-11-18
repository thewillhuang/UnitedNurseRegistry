import React from 'react';
import {TextField, Snackbar} from 'material-ui';
import user from '../../utils/grabUser.js';
import facilityApi from '../../webapi/facilityApi.js';

const SecurityCard = React.createClass({

  handleSubmit() {
    const nPassword = this.refs.nPassword.getValue() || null;
    const nPassword2 = this.refs.nPassword2.getValue() || null;
    const ctx = this;
    if (nPassword !== null && nPassword === nPassword2) {
      facilityApi.updateFacilityInfo(user.scope.facilityID, null, null, null, nPassword, null)
      .then((res) => {
        console.log(res);
        ctx.refs.submitted.show();
      });
    }
  },

  render() {
    return (
      <div className='card'>
        <Snackbar
          ref='submitted'
          action='OK'
          message='Password Updated'
          autoHideDuration={5000}
        />
        <div className='cardTitle'>
          Security
        </div>
        <hr className='cardDivider' />
        <div className='cardBody'>
          <TextField
            ref='nPassword'
            onEnterKeyDown={this.handleSubmit}
            type='password'
            floatingLabelText='New Password'
            hintText='New Password' />
          <br/>
          <TextField
            ref='nPassword2'
            onEnterKeyDown={this.handleSubmit}
            type='password'
            floatingLabelText='Repeat New Password'
            hintText='Repeat New Password' />
          <br/>
        </div>
      </div>
    );
  },
});

export default SecurityCard;
