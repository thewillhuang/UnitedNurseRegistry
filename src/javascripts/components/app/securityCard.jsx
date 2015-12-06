import React from 'react';
import {TextField} from 'material-ui';

const SecurityCard = React.createClass({
  render: function () {
    return (
      <div className='card'>
        <div className='cardTitle'>
          Security
        </div>
        <hr className='cardDivider' />
        <div className='cardBody'>
          <TextField
            ref='nPassword'
            type='password'
            floatingLabelText='New Password'
            hintText='New Password' />
          <br/>
          <TextField
            ref='nPassword2'
            type='password'
            floatingLabelText='Repeat New Password'
            hintText='Repeat New Password' />
          <br/>
          <TextField
            ref='nPin'
            type='password'
            floatingLabelText='New Pin'
            hintText='New Pin' />
          <br/>
          <TextField
            ref='nPin2'
            type='password'
            floatingLabelText='Repeat New Pin'
            hintText='Repeat New Pin' />
          <br/>
        </div>
      </div>
    );
  },
});

export default SecurityCard;
