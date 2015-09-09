

import React from 'react';

class ForNurses extends React.Component {
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
            <h1>Connect</h1>
            <p>Set up an account and connect to your bank account</p>
          </div>
          <div href='#' className='grid2-item'>
            <i className='fa icon-check fa-2x grid2-i'></i>
            <h1>Accept Shifts</h1>
            <p>Get notifications from the hospitals around you. Bid and Accept the shifts you want.</p>
          </div>
          <div href='#' className='grid2-item'>
            <i className='fa icon-wallet fa-2x grid2-i'></i>
            <h1>Receive Money</h1>
            <p>Money in your bank account in 2 days after your shift</p>
          </div>
        </div>

      </div>
    );
  }
}

export default ForNurses;
