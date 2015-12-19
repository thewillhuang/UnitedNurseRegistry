import React from 'react';
import { IconMenu, IconButton } from 'material-ui';
const MenuItem = require('material-ui/lib/menus/menu-item');
import user from '../../utils/grabUser.js';
const facilityID = user.scope.facilityID;
import facilityApi from '../../webapi/facilityApi.js';

const AppBar = React.createClass({

  getInitialState() {
    return {
      userName: 'Hospital Name',
    };
  },

  componentDidMount() {
    const ctx = this;
    facilityApi.getFacilityInfo(facilityID)
    .then(data => {
      ctx.setState({ userName: data.rows[0].facilityName });
    });
  },

  componentWillUnmount() {
    window.sessionStorage.clear();
  },

  render() {
    return (
      <div className='appBar'>
        <div className='appBarUser'>
          <div className='appUserWrap'>
            <div className='appUserPhoto'>
              <img src='../../../images/sourcefusion-final.jpg'/>
            </div>
            <div className='appUserName'>
              {this.state.userName}
            </div>
          </div>
        </div>
        <div className='appBarMenuButton'>
          <IconMenu
            openDirection='bottom-left'
            iconButtonElement={
              <IconButton
                style={{ color: 'rgb(180, 180, 180)' }}
                iconClassName='icon-menu'
                tooltip='menu'
              />
            }
          >
            <MenuItem
              onClick={() => {window.location.assign('/'); }}
              primaryText='Logout'
            />
          </IconMenu>
        </div>
        <div className='appBarTitle'>
          <a href='#/hospital/shifts'>
            <p>Hospital Dashboard</p>
          </a>
        </div>
      </div>
    );
  },
});

export default AppBar;
