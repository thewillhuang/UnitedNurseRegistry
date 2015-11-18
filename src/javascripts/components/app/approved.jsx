import React from 'react';
import Approved from './approvedShifts.jsx';

const Shift = React.createClass({
  render: function() {
    return (
      <div className='appShift'>
        <div className='appShiftResult'>
          <div className='card'>
            <div className='cardTitle'>
              Approved Shifts
            </div>
            <hr className='cardDivider' />
            <div className='cardBody'>
              <Approved />
            </div>
          </div>
        </div>
      </div>
    );
  },
});

export default Shift;
