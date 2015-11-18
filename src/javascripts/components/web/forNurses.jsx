import React from 'react';

const ForNurses = React.createClass({
  render() {
    return (
      <div>

        <div className='nurse-wrapper'>
          <div className='nurse-title'>
            <hr className='nurse-hr'></hr>
          </div>
        </div>

        <div className='grid2-items-lines'>
          <div href='#' className='grid2-item'>
            <i className='fa icon-share fa-2x grid2-i'></i>
            <h1>Make more money</h1>
            <p>We pay top industry competitive rates.</p>
          </div>
          <div href='#' className='grid2-item'>
            <i className='fa icon-check fa-2x grid2-i'></i>
            <h1>Make your own schedule</h1>
            <p>Get notifications from the hospitals around you. Accept the shifts you want.</p>
          </div>
          <div href='#' className='grid2-item'>
            <i className='fa icon-wallet fa-2x grid2-i'></i>
            <h1>Pay</h1>
            <p>Get paid within 3 days after your shift</p>
          </div>
        </div>

      </div>
    );
  },
});

export default ForNurses;
