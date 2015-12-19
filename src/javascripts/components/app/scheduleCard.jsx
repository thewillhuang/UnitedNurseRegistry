import React from 'react';
import { TextField, Checkbox } from 'material-ui';

const ScheduleCard = React.createClass({
  render() {
    return (
      <div className='card'>
        <div className='cardTitle'>
          Schedule
        </div>
        <hr className='cardDivider' />
        <div className='cardBody'>
          <TextField
            ref='pay'
            floatingLabelText='Minimum Pay Per Hour'
            hintText='Minimum Pay Per Hour'
          />
          <Checkbox
            name='mon'
            value='mon'
            label='Monday'
          />
          <Checkbox
            name='tu'
            value='tu'
            label='Tuesday'
          />
          <Checkbox
            name='wed'
            value='wed'
            label='Wednesday'
          />
          <Checkbox
            name='th'
            value='th'
            label='Thursday'
          />
          <Checkbox
            name='fri'
            value='fri'
            label='Friday'
          />
          <Checkbox
            name='sat'
            value='sat'
            label='Saturday'
          />
          <Checkbox
            name='sun'
            value='sun'
            label='Sunday'
          />
          <Checkbox
            name='day'
            value='day'
            label='Day Shift'
          />
          <Checkbox
            name='night'
            value='night'
            label='Night Shift'
          />
        </div>
      </div>
    );
  },
});

export default ScheduleCard;
