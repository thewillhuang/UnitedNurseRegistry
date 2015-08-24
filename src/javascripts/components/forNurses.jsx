'use strict';

import React from 'react';

export class ForNurses extends React.Component {
  render() {
    return (
      <div>

        <div className='nurse-wrapper'>
          <div className='nurse-title'>
            <hr className='nurse-hr'></hr>
          </div>
        </div>

        <div className='grid2-items-lines'>
          <a href='#' className='grid2-item'>
            <i className='fa icon-link fa-2x grid2-i'></i>
            <h1>Connect</h1>
            <p>Set up an account and Connect to your bank account</p>
          </a>
          <a href='#' className='grid2-item'>
            <i className='fa icon-check fa-2x grid2-i'></i>
            <h1>Accept Shifts</h1>
            <p>Get notifications from the hospitals around you. Accept the ones you want.</p>
          </a>
          <a href='#' className='grid2-item'>
            <i className='fa icon-wallet fa-2x grid2-i'></i>
            <h1>Receive Money</h1>
            <p>Get Money in your bank account in 2 days</p>
          </a>
          <div className='right-cover2'></div>
          <div className='bottom-cover2'></div>
        </div>

      </div>
    );
  }
}
