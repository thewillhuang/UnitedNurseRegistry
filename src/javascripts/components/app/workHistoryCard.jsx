import React from 'react';
import { TextField } from 'material-ui';

const WorkHistoryCard = React.createClass({
  render() {
    return (
      <div className='card'>
        <div className='cardTitle'>
          Work History
        </div>
        <hr className='cardDivider' />
        <div className='cardBody'>
          <TextField
            ref='facilityName'
            floatingLabelText='Facility Name'
            hintText='Facility Name'
          />
          <br/>
          <TextField
            ref='duration'
            floatingLabelText='Duration'
            hintText='Duration'
          />
          <br/>
          <TextField
            ref='reference'
            floatingLabelText='Reference Name'
            hintText='Reference Name'
          />
          <br/>
          <TextField
            ref='reference phone'
            floatingLabelText='Reference Phone'
            hintText='Reference Phone'
          />
        </div>
      </div>
    );
  },
});

export default WorkHistoryCard;
