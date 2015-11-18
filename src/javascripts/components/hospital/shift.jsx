import React from 'react';
import PostShifts from './postShifts.jsx';
import ShiftFeedback from './shiftFeedback.jsx';

const Shift = React.createClass({
  render() {
    return (
      <div className='hospitalShifts'>
        <div className='postShifts'>
          <div className='card'>
            <div className='cardTitle'>
              Post Shifts
            </div>
            <hr className='cardDivider' />
            <div className='cardBody'>
              <PostShifts />
            </div>
          </div>
        </div>
        <div className='shiftFeedback'>
          <div className='card'>
            <div className='cardTitle'>
              Feedbacks
            </div>
            <hr className='cardDivider' />
            <div className='cardBody'>
              <ShiftFeedback />
            </div>
          </div>
        </div>
      </div>
    );
  },
});

export default Shift;
