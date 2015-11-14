import React from 'react';

export default class ForReferrals extends React.Component {
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
            <p>Set up an account</p>
          </div>
          <div href='#' className='grid2-item'>
            <i className='fa icon-heart fa-2x grid2-i'></i>
            <h1>Share the love</h1>
            <p>Get 10% of what we make from every shift for each referral. Includes hospitals</p>
          </div>
          <div href='#' className='grid2-item'>
            <i className='fa icon-people fa-2x grid2-i'></i>
            <h1>Become an affiliate</h1>
            <p>Be a part of our team</p>
          </div>
        </div>

      </div>
    );
  }
}
