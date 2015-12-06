import React from 'react';
import Pending from './pendingShifts.jsx';

const Shift = React.createClass({
  render: function () {
    return (
      <div className='appShift'>
        <div className='appShiftResult'>
          <div className='card'>
            <div className='cardTitle'>
              Pending Shifts
            </div>
            <hr className='cardDivider' />
            <div className='cardBody'>
              <Pending />
            </div>
          </div>
        </div>
      </div>
    );
  },
});

export default Shift;
