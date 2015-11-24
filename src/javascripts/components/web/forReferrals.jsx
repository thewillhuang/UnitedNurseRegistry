import React from 'react';

const ForReferrals = React.createClass({
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
            <i className='icon-share fa-2x grid2-i'></i>
            <h1>Connect</h1>
            <p>Set up an account</p>
          </div>
          <div href='#' className='grid2-item'>
            <i className='icon-heart fa-2x grid2-i'></i>
            <h1>Share the love</h1>
            <p>Get 10% of what we make from every shift for each referral. Includes hospitals</p>
          </div>
          <div href='#' className='grid2-item'>
            <i className='icon-people fa-2x grid2-i'></i>
            <h1>Become an affiliate</h1>
            <p>Be a part of our team</p>
          </div>
        </div>

      </div>
    );
  },
});

export default ForReferrals;
