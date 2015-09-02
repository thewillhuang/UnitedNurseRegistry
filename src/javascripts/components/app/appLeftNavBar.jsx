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
  }

  componentWillUnmount() {
    windown.removeEventListener('hashchange', this.hashChange, false);
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
            <div className='appNameItemWrap'>
              <FontIcon
                color='rgb(199, 199, 199)'
                className='icon-briefcase'/>
              <a href='#/app/shifts'>
                Shifts
              </a>
            </div>
          </li>
          <li
            onClick={()=> {window.location.assign('/#/app/profile'); }}
            className={'appNavItems ' + this.state.profile}>
            <div className='appNameItemWrap'>
              <FontIcon
                color='rgb(199, 199, 199)'
                className='icon-user'/>
              <a href='#/app/profile'>
                Profile
              </a>
            </div>
          </li>
          <li
            onClick={()=> {window.location.assign('/#/app/balance'); }}
            className={'appNavItems ' + this.state.balance}>
            <div className='appNameItemWrap'>
              <FontIcon
                color='rgb(199, 199, 199)'
                className='icon-graph'/>
              <a href='#/app/balance'>
                Balance
              </a>
            </div>
          </li>
          <li
            onClick={()=> {window.location.assign('/#/app/reviews'); }}
            className={'appNavItems ' + this.state.reviews}>
            <div className='appNameItemWrap'>
              <FontIcon
                color='rgb(199, 199, 199)'
                className='icon-star'/>
              <a href='#/app/reviews'>
                Reviews
              </a>
            </div>
          </li>
          <li
            onClick={()=> {window.location.assign('/#/app/referrals'); }}
            className={'appNavItems ' + this.state.referrals}>
            <div className='appNameItemWrap'>
              <FontIcon
                color='rgb(199, 199, 199)'
                className='icon-heart'/>
              <a href='#/app/referrals'>
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
