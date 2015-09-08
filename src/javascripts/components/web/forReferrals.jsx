

import React from 'react';

class ForReferrals extends React.Component {
  render() {
    return (
      <div>

        <div className='referral-wrapper'>
          <div className='referral-title'>
            <hr className='referral-hr'></hr>
          </div>
        </div>

        <div className='grid2-items-lines'>
          <div href='#' className='grid2-item'>
            <i className='fa icon-share fa-2x grid2-i'></i>
            <h1>Connect</h1>
            <p>Set up an account and Connect to your bank account</p>
          </div>
          <div href='#' className='grid2-item'>
            <i className='fa icon-heart fa-2x grid2-i'></i>
            <h1>Share the love</h1>
            <p>Get $5 from every shift completed due to your personal referral. Includes Hospitals</p>
          </div>
          <div href='#' className='grid2-item'>
            <i className='fa icon-present fa-2x grid2-i'></i>
            <h1>Receive Money</h1>
            <p>Get Money in your bank account every month</p>
          </div>
        </div>

      </div>
    );
  }
}

export default ForReferrals;
