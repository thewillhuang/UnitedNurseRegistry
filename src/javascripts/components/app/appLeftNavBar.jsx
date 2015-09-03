'use strict';

import React from 'react';
import mui, { FontIcon } from 'material-ui';
// const MenuItem = require('material-ui/lib/menus/menu-item');
// const MenuDivider = require('material-ui/lib/menus/menu-divider');
const ThemeManager = new mui.Styles.ThemeManager();
// import MediaQuery from 'react-responsive';

class AppLeftNavBar extends React.Component {
  state = {
    userName: 'User',
    route: '/',
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
    case '#/app/shifts':
      this.setState({
        shift: 'isActive',
        profile: '',
        balance: '',
        reviews: '',
        referrals: '',
      });
      break;
    case '#/app/profile':
      this.setState({
        shift: '',
        profile: 'isActive',
        balance: '',
        reviews: '',
        referrals: '',
      });
      break;
    case '#/app/balance':
      this.setState({
        shift: '',
        profile: '',
        balance: 'isActive',
        reviews: '',
        referrals: '',
      });
      break;
    case '#/app/reviews':
      this.setState({
        shift: '',
        profile: '',
        balance: '',
        reviews: 'isActive',
        referrals: '',
      });
      break;
    case '#/app/referrals':
      this.setState({
        shift: '',
        profile: '',
        balance: '',
        reviews: '',
        referrals: 'isActive',
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
            onClick={()=> {window.location.assign('/#/app/shifts'); }}
            className={'appNavItems ' + this.state.shift} >
            <div className={'appNameItemWrap ' + this.state.shift}>
              <FontIcon
                color='rgb(199, 199, 199)'
                className={'icon-briefcase ' + this.state.shift}/>
              <a href='#/app/shifts' className={'appNavText' + this.state.shift}>
                Shifts
              </a>
            </div>
          </li>
          <li
            onClick={()=> {window.location.assign('/#/app/profile'); }}
            className={'appNavItems ' + this.state.profile}>
            <div className={'appNameItemWrap ' + this.state.profile}>
              <FontIcon
                color='rgb(199, 199, 199)'
                className={'icon-user ' + this.state.profile}/>
              <a href='#/app/profile' className={'appNavText' + this.state.profile}>
                Profile
              </a>
            </div>
          </li>
          <li
            onClick={()=> {window.location.assign('/#/app/balance'); }}
            className={'appNavItems ' + this.state.balance}>
            <div className={'appNameItemWrap ' + this.state.balance}>
              <FontIcon
                color='rgb(199, 199, 199)'
                className={'icon-graph ' + this.state.balance}/>
              <a href='#/app/balance' className={'appNavText' + this.state.balance}>
                Balance
              </a>
            </div>
          </li>
          <li
            onClick={()=> {window.location.assign('/#/app/reviews'); }}
            className={'appNavItems ' + this.state.reviews}>
            <div className={'appNameItemWrap ' + this.state.reviews}>
              <FontIcon
                color='rgb(199, 199, 199)'
                className={'icon-star ' + this.state.reviews}/>
              <a href='#/app/reviews' className={'appNavText' + this.state.reviews}>
                Reviews
              </a>
            </div>
          </li>
          <li
            onClick={()=> {window.location.assign('/#/app/referrals'); }}
            className={'appNavItems ' + this.state.referrals}>
            <div className={'appNameItemWrap ' + this.state.referrals}>
              <FontIcon
                color='rgb(199, 199, 199)'
                className={'icon-heart ' + this.state.referrals}/>
              <a href='#/app/referrals' className={'appNavText' + this.state.referrals}>
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
