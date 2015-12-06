import React from 'react';

const AppLeftNavBar = React.createClass({
  getInitialState: function () {
    return {
      userName: 'User',
      shift: '',
      profile: '',
      balance: '',
      reviews: '',
      referrals: '',
      pending: '',
      approved: '',
    };
  },

  componentDidMount: function () {
    window.addEventListener('hashchange', this.hashChange, false);
    this.hashChange();
  },

  componentWillUnmount: function () {
    window.removeEventListener('hashchange', this.hashChange, false);
  },

  hashChange: function () {
    const route = window.location.hash;
    if (route.indexOf('#/app/shifts') !== -1) {
      this.setState({
        shift: 'isActive',
        profile: '',
        balance: '',
        reviews: '',
        referrals: '',
        shiftColor: 'white',
        pending: '',
        approved: '',
        approvedColor: 'rgb(198, 198, 198)',
        pendingColor: 'rgb(198, 198, 198)',
        profileColor: 'rgb(198, 198, 198)',
        balanceColor: 'rgb(198, 198, 198)',
        reviewsColor: 'rgb(198, 198, 198)',
        referralsColor: 'rgb(198, 198, 198)',
      });
    } else if (route.indexOf('#/app/profile') !== -1) {
      this.setState({
        shift: '',
        profile: 'isActive',
        balance: '',
        reviews: '',
        referrals: '',
        pending: '',
        approved: '',
        approvedColor: 'rgb(198, 198, 198)',
        pendingColor: 'rgb(198, 198, 198)',
        shiftColor: 'rgb(198, 198, 198)',
        profileColor: 'white',
        balanceColor: 'rgb(198, 198, 198)',
        reviewsColor: 'rgb(198, 198, 198)',
        referralsColor: 'rgb(198, 198, 198)',
      });
    } else if (route.indexOf('#/app/pending') !== -1) {
      this.setState({
        shift: '',
        profile: '',
        balance: '',
        reviews: '',
        referrals: '',
        pending: 'isActive',
        approved: '',
        approvedColor: 'rgb(198, 198, 198)',
        pendingColor: 'white',
        shiftColor: 'rgb(198, 198, 198)',
        profileColor: 'rgb(198, 198, 198)',
        balanceColor: 'rgb(198, 198, 198)',
        reviewsColor: 'rgb(198, 198, 198)',
        referralsColor: 'rgb(198, 198, 198)',
      });
    } else if (route.indexOf('#/app/approved') !== -1) {
      this.setState({
        shift: '',
        profile: '',
        balance: '',
        reviews: '',
        referrals: '',
        pending: '',
        approved: 'isActive',
        approvedColor: 'white',
        pendingColor: 'rgb(198, 198, 198)',
        shiftColor: 'rgb(198, 198, 198)',
        profileColor: 'rgb(198, 198, 198)',
        balanceColor: 'rgb(198, 198, 198)',
        reviewsColor: 'rgb(198, 198, 198)',
        referralsColor: 'rgb(198, 198, 198)',
      });
    } else if (route.indexOf('#/app/balance') !== -1) {
      this.setState({
        shift: '',
        profile: '',
        balance: 'isActive',
        reviews: '',
        referrals: '',
        pending: '',
        approved: '',
        approvedColor: 'rgb(198, 198, 198)',
        pendingColor: 'rgb(198, 198, 198)',
        shiftColor: 'rgb(198, 198, 198)',
        profileColor: 'rgb(198, 198, 198)',
        balanceColor: 'white',
        reviewsColor: 'rgb(198, 198, 198)',
        referralsColor: 'rgb(198, 198, 198)',
      });
    } else if (route.indexOf('#/app/reviews') !== -1) {
      this.setState({
        shift: '',
        profile: '',
        balance: '',
        reviews: 'isActive',
        referrals: '',
        pending: '',
        approved: '',
        approvedColor: 'rgb(198, 198, 198)',
        pendingColor: 'rgb(198, 198, 198)',
        shiftColor: 'rgb(198, 198, 198)',
        profileColor: 'rgb(198, 198, 198)',
        balanceColor: 'rgb(198, 198, 198)',
        reviewsColor: 'white',
        referralsColor: 'rgb(198, 198, 198)',
      });
    } else if (route.indexOf('#/app/referrals') !== -1) {
      this.setState({
        shift: '',
        profile: '',
        balance: '',
        reviews: '',
        referrals: 'isActive',
        pending: '',
        approved: '',
        approvedColor: 'rgb(198, 198, 198)',
        pendingColor: 'rgb(198, 198, 198)',
        shiftColor: 'rgb(198, 198, 198)',
        profileColor: 'rgb(198, 198, 198)',
        balanceColor: 'rgb(198, 198, 198)',
        reviewsColor: 'rgb(198, 198, 198)',
        referralsColor: 'white',
      });
    }
  },

  render: function () {
    return (
      <div className='appNavBar'>
        <link rel='stylesheet' href='/stylesheets/app.css' />
        <ul className='appNavMenu'>
          <li
            onClick={()=> {window.location.assign('#app/shifts'); }}
            className={'appNavItems ' + this.state.shift} >
            <div className={'appNameItemWrap ' + this.state.shift}>
              <i className={'icon-briefcase fa-2x ' + this.state.shift}/>
              <a href='#/app/shifts' style={{color: this.state.shiftColor}} className={'appNavText ' + this.state.shift}>
                Shifts
              </a>
            </div>
          </li>
          <li
            onClick={()=> {window.location.assign('#app/pending'); }}
            className={'appNavItems ' + this.state.pending} >
            <div className={'appNameItemWrap ' + this.state.pending}>
              <i className={'icon-clock fa-2x ' + this.state.pending}/>
              <a href='#/app/pending' style={{color: this.state.pendingColor}} className={'appNavText ' + this.state.pending}>
                Requested Shifts
              </a>
            </div>
          </li>
          <li
            onClick={()=> {window.location.assign('#app/approved'); }}
            className={'appNavItems ' + this.state.approved} >
            <div className={'appNameItemWrap ' + this.state.approved}>
              <i className={'icon-check fa-2x ' + this.state.approved}/>
              <a href='#/app/approved' style={{color: this.state.approvedColor}} className={'appNavText ' + this.state.approved}>
                Approved Shifts
              </a>
            </div>
          </li>
          <li
            onClick={()=> {window.location.assign('#app/profile'); }}
            className={'appNavItems ' + this.state.profile}>
            <div className={'appNameItemWrap ' + this.state.profile}>
              <i className={'icon-user fa-2x ' + this.state.profile}/>
              <a href='#/app/profile' style={{color: this.state.profileColor}} className={'appNavText ' + this.state.profile}>
                Profile
              </a>
            </div>
          </li>
          <li
            onClick={()=> {window.location.assign('#app/balance'); }}
            className={'appNavItems ' + this.state.balance}>
            <div className={'appNameItemWrap ' + this.state.balance}>
              <i className={'icon-graph fa-2x ' + this.state.balance}/>
              <a href='#/app/balance' style={{color: this.state.balanceColor}} className={'appNavText ' + this.state.balance}>
                Balance
              </a>
            </div>
          </li>
          <li
            onClick={()=> {window.location.assign('#app/reviews'); }}
            className={'appNavItems ' + this.state.reviews}>
            <div className={'appNameItemWrap ' + this.state.reviews}>
              <i className={'icon-star fa-2x ' + this.state.reviews}/>
              <a href='#/app/reviews' style={{color: this.state.reviewsColor}} className={'appNavText ' + this.state.reviews}>
                Reviews
              </a>
            </div>
          </li>
          <li
            onClick={()=> {window.location.assign('#app/referrals'); }}
            className={'appNavItems ' + this.state.referrals}>
            <div className={'appNameItemWrap ' + this.state.referrals}>
              <i className={'icon-heart fa-2x ' + this.state.referrals}/>
              <a href='#/app/referrals' style={{color: this.state.referralsColor}} className={'appNavText ' + this.state.referrals}>
                referrals
              </a>
            </div>
          </li>
        </ul>
      </div>
    );
  },
});

export default AppLeftNavBar;
