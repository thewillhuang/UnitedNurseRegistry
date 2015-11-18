import React from 'react';
import PendingTable from './pendingTable.jsx';

const Reviews = React.createClass({

  render() {
    return (
      <div className='appShift'>
        <div className='appShiftResult'>
          <div className='card'>
            <div className='cardTitle'>
              Shift Pending for approvals
            </div>
            <hr className='cardDivider' />
            <div className='cardBody'>
              <PendingTable />
            </div>
          </div>
        </div>
      </div>
    );
  },
});

export default Reviews;
