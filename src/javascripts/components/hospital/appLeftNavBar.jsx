import React from 'react';
import mui from 'material-ui';
// const MenuItem = require('material-ui/lib/menus/menu-item');
// const MenuDivider = require('material-ui/lib/menus/menu-divider');
const ThemeManager = new mui.Styles.ThemeManager();
// import MediaQuery from 'react-responsive';
class AppLeftNavBar extends React.Component {
  state = {
    userName: 'User',
    shift: '',
    profile: '',
    balance: '',
    reviews: '',
    referrals: '',
  }

  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', this.hashChange, false);
    this.hashChange();
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.hashChange, false);
  }

  hashChange = () => {
    const route = window.location.hash;
    switch (route) {
    case '#/hospital/shifts':
      this.setState({
        shift: 'isActive',
        profile: '',
        balance: '',
        reviews: '',
        referrals: '',
        shiftColor: 'white',
        profileColor: 'rgb(198, 198, 198)',
        balanceColor: 'rgb(198, 198, 198)',
        reviewsColor: 'rgb(198, 198, 198)',
        referralsColor: 'rgb(198, 198, 198)',
      });
      break;
    case '#/hospital/profile':
      this.setState({
        shift: '',
        profile: 'isActive',
        balance: '',
        reviews: '',
        referrals: '',
        shiftColor: 'rgb(198, 198, 198)',
        profileColor: 'white',
        balanceColor: 'rgb(198, 198, 198)',
        reviewsColor: 'rgb(198, 198, 198)',
        referralsColor: 'rgb(198, 198, 198)',
      });
      break;
    case '#/hospital/balance':
      this.setState({
        shift: '',
        profile: '',
        balance: 'isActive',
        reviews: '',
        referrals: '',
        shiftColor: 'rgb(198, 198, 198)',
        profileColor: 'rgb(198, 198, 198)',
        balanceColor: 'white',
        reviewsColor: 'rgb(198, 198, 198)',
        referralsColor: 'rgb(198, 198, 198)',
      });
      break;
    case '#/hospital/reviews':
      this.setState({
        shift: '',
        profile: '',
        balance: '',
        reviews: 'isActive',
        referrals: '',
        shiftColor: 'rgb(198, 198, 198)',
        profileColor: 'rgb(198, 198, 198)',
        balanceColor: 'rgb(198, 198, 198)',
        reviewsColor: 'white',
        referralsColor: 'rgb(198, 198, 198)',
      });
      break;
    case '#/hospital/referrals':
      this.setState({
        shift: '',
        profile: '',
        balance: '',
        reviews: '',
        referrals: 'isActive',
        shiftColor: 'rgb(198, 198, 198)',
        profileColor: 'rgb(198, 198, 198)',
        balanceColor: 'rgb(198, 198, 198)',
        reviewsColor: 'rgb(198, 198, 198)',
        referralsColor: 'white',
      });
      break;
    default:
      break;
    }
  }

  render() {
    return (
      <div className='appNavBar'>
        <ul className='appNavMenu'>
          <li
            onClick={()=> {window.location.assign('/#/hospital/shifts'); }}
            className={'appNavItems ' + this.state.shift} >
            <div className={'appNameItemWrap ' + this.state.shift}>
              <i className={'icon-briefcase fa-2x ' + this.state.shift}/>
              <a href='#/hospital/shifts' style={{color: this.state.shiftColor}} className={'appNavText ' + this.state.shift}>
                Shifts
              </a>
            </div>
          </li>
          <li
            onClick={()=> {window.location.assign('/#/hospital/profile'); }}
            className={'appNavItems ' + this.state.profile}>
            <div className={'appNameItemWrap ' + this.state.profile}>
              <i className={'icon-user fa-2x ' + this.state.profile}/>
              <a href='#/hospital/profile' style={{color: this.state.profileColor}} className={'appNavText ' + this.state.profile}>
                Profile
              </a>
            </div>
          </li>
          <li
            onClick={()=> {window.location.assign('/#/hospital/balance'); }}
            className={'appNavItems ' + this.state.balance}>
            <div className={'appNameItemWrap ' + this.state.balance}>
              <i className={'icon-graph fa-2x ' + this.state.balance}/>
              <a href='#/hospital/balance' style={{color: this.state.balanceColor}} className={'appNavText ' + this.state.balance}>
                Balance
              </a>
            </div>
          </li>
          <li
            onClick={()=> {window.location.assign('/#/hospital/reviews'); }}
            className={'appNavItems ' + this.state.reviews}>
            <div className={'appNameItemWrap ' + this.state.reviews}>
              <i className={'icon-star fa-2x ' + this.state.reviews}/>
              <a href='#/hospital/reviews' style={{color: this.state.reviewsColor}} className={'appNavText ' + this.state.reviews}>
                Reviews
              </a>
            </div>
          </li>
          <li
            onClick={()=> {window.location.assign('/#/hospital/referrals'); }}
            className={'appNavItems ' + this.state.referrals}>
            <div className={'appNameItemWrap ' + this.state.referrals}>
              <i className={'icon-heart fa-2x ' + this.state.referrals}/>
              <a href='#/hospital/referrals' style={{color: this.state.referralsColor}} className={'appNavText ' + this.state.referrals}>
                referrals
              </a>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

export default AppLeftNavBar;
