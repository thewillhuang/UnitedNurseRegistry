import React from 'react';
import Approved from './approvedTable.jsx';

const Reviews = React.createClass({
  render() {
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

export default Reviews;
