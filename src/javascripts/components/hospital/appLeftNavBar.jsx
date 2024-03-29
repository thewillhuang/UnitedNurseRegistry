import React from 'react';

const AppLeftNavBar = React.createClass({
  getInitialState() {
    return {
      userName: 'User',
      shift: '',
      profile: '',
      balance: '',
      reviews: '',
      referrals: '',
      invoice: '',
      pending: '',
      approved: '',
    };
  },

  componentDidMount() {
    window.addEventListener('hashchange', this.hashChange, false);
    this.hashChange();
  },

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.hashChange, false);
  },

  hashChange() {
    // console.log('hash change detected');
    const route = window.location.hash;
    if (route.indexOf('#/hospital/shifts') !== -1) {
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
        invoiceColor: 'rgb(198, 198, 198)',
      });
    } else if (route.indexOf('#/hospital/profile') !== -1) {
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
        invoiceColor: 'rgb(198, 198, 198)',
      });
    } else if (route.indexOf('#/hospital/approved') !== -1) {
      this.setState({
        shift: '',
        profile: '',
        balance: '',
        reviews: '',
        invoice: '',
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
        invoiceColor: 'rgb(198, 198, 198)',
      });
    } else if (route.indexOf('#/hospital/balance') !== -1) {
      this.setState({
        shift: '',
        profile: '',
        invoice: '',
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
        invoiceColor: 'rgb(198, 198, 198)',
      });
    } else if (route.indexOf('#/hospital/reviews') !== -1) {
      this.setState({
        shift: '',
        profile: '',
        invoice: '',
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
        invoiceColor: 'rgb(198, 198, 198)',
      });
    } else if (route.indexOf('#/hospital/invoice') !== -1) {
      this.setState({
        shift: '',
        profile: '',
        invoice: 'isActive',
        balance: '',
        reviews: '',
        referrals: '',
        pending: '',
        approved: '',
        approvedColor: 'rgb(198, 198, 198)',
        pendingColor: 'rgb(198, 198, 198)',
        shiftColor: 'rgb(198, 198, 198)',
        profileColor: 'rgb(198, 198, 198)',
        balanceColor: 'rgb(198, 198, 198)',
        reviewsColor: 'rgb(198, 198, 198)',
        referralsColor: 'rgb(198, 198, 198)',
        invoiceColor: 'white',
      });
    } else if (route.indexOf('#/hospital/pending') !== -1) {
      this.setState({
        shift: '',
        profile: '',
        invoice: '',
        balance: '',
        reviews: '',
        pending: 'isActive',
        referrals: '',
        approved: '',
        approvedColor: 'rgb(198, 198, 198)',
        shiftColor: 'rgb(198, 198, 198)',
        profileColor: 'rgb(198, 198, 198)',
        balanceColor: 'rgb(198, 198, 198)',
        reviewsColor: 'rgb(198, 198, 198)',
        referralsColor: 'rgb(198, 198, 198)',
        invoiceColor: 'rgb(198, 198, 198)',
        pendingColor: 'white',
      });
    } else if (route.indexOf('#/hospital/referrals') !== -1) {
      this.setState({
        shift: '',
        profile: '',
        invoice: '',
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
        invoiceColor: 'rgb(198, 198, 198)',
      });
    }
  },

  render() {
    // console.log(this.state);
    return (
      <div className='appNavBar'>
        <link rel='stylesheet' href='/stylesheets/app.css' />
        <ul className='appNavMenu'>
          <li
            onClick={() => {window.location.assign('#hospital/shifts'); }}
            className={'appNavItems ' + this.state.shift}
          >
            <div className={'appNameItemWrap ' + this.state.shift}>
              <i className={'icon-briefcase fa-2x ' + this.state.shift}/>
              <a href='#/hospital/shifts' style={{ color: this.state.shiftColor }} className={'appNavText ' + this.state.shift}>
                Shifts
              </a>
            </div>
          </li>
          <li
            onClick={() => {window.location.assign('#hospital/pending'); }}
            className={'appNavItems ' + this.state.pending}
          >
            <div className={'appNameItemWrap ' + this.state.pending}>
              <i className={'icon-clock fa-2x ' + this.state.pending}/>
              <a href='#/hospital/pending' style={{ color: this.state.pendingColor }} className={'appNavText ' + this.state.pending}>
                Pending shifts
              </a>
            </div>
          </li>
          <li
            onClick={() => {window.location.assign('#hospital/approved'); }}
            className={'appNavItems ' + this.state.approved}
          >
            <div className={'appNameItemWrap ' + this.state.approved}>
              <i className={'icon-check fa-2x ' + this.state.approved}/>
              <a href='#/hospital/approved' style={{ color: this.state.approvedColor }} className={'appNavText ' + this.state.approved}>
                Approved shifts
              </a>
            </div>
          </li>
          <li
            onClick={() => {window.location.assign('#hospital/invoice'); }}
            className={'appNavItems ' + this.state.invoice}
          >
            <div className={'appNameItemWrap ' + this.state.invoice}>
              <i className={'icon-credit-card fa-2x ' + this.state.invoice}/>
              <a href='#/hospital/invoice' style={{ color: this.state.invoiceColor }} className={'appNavText ' + this.state.invoice}>
                invoice
              </a>
            </div>
          </li>
          <li
            onClick={() => {window.location.assign('#hospital/profile'); }}
            className={'appNavItems ' + this.state.profile}
          >
            <div className={'appNameItemWrap ' + this.state.profile}>
              <i className={'icon-user fa-2x ' + this.state.profile}/>
              <a href='#/hospital/profile' style={{ color: this.state.profileColor }} className={'appNavText ' + this.state.profile}>
                Profile
              </a>
            </div>
          </li>
          <li
            onClick={() => {window.location.assign('#hospital/balance'); }}
            className={'appNavItems ' + this.state.balance}
          >
            <div className={'appNameItemWrap ' + this.state.balance}>
              <i className={'icon-graph fa-2x ' + this.state.balance}/>
              <a href='#/hospital/balance' style={{ color: this.state.balanceColor }} className={'appNavText ' + this.state.balance}>
                Balance
              </a>
            </div>
          </li>
          <li
            onClick={() => {window.location.assign('#hospital/reviews'); }}
            className={'appNavItems ' + this.state.reviews}
          >
            <div className={'appNameItemWrap ' + this.state.reviews}>
              <i className={'icon-star fa-2x ' + this.state.reviews}/>
              <a href='#/hospital/reviews' style={{ color: this.state.reviewsColor }} className={'appNavText ' + this.state.reviews}>
                Reviews
              </a>
            </div>
          </li>
          <li
            onClick={() => {window.location.assign('#hospital/referrals'); }}
            className={'appNavItems ' + this.state.referrals}
          >
            <div className={'appNameItemWrap ' + this.state.referrals}>
              <i className={'icon-heart fa-2x ' + this.state.referrals}/>
              <a href='#/hospital/referrals' style={{ color: this.state.referralsColor }} className={'appNavText ' + this.state.referrals}>
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
