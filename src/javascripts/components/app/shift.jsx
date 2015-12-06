import React from 'react';
import ShiftHospital from './shiftHospitalTable.jsx';

const Shift = React.createClass({
  render: function () {
    return (
      <div className='appShift'>
        <div className='appShiftResult'>
          <div className='card'>
            <div className='cardTitle'>
              Hospitals
            </div>
            <hr className='cardDivider' />
            <div className='cardBody'>
              <ShiftHospital />
            </div>
          </div>
        </div>
      </div>
    );
  },
});

export default Shift;
