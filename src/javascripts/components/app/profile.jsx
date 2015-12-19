

import React from 'react';
import { FlatButton } from 'material-ui';
import ProfileCard from './profileCard.jsx';
// import ShiftFilter from './shiftFilter.jsx';
// import ShiftHospital from './shiftHospitalTable.jsx';
// const ThemeManager = new mui.Styles.ThemeManager();
// const MenuItem = require('material-ui/lib/menus/menu-item');
// const MenuDivider = require('material-ui/lib/menus/menu-divider');
// import MediaQuery from 'react-responsive';

const Profile = React.createClass({
  propTypes: {
    children: React.PropTypes.node,
  },

  render() {
    return (
      <div className='appProfile'>
        <div className='appProfileList'>
          <div className='card'>
            <div className='cardTitle'>
              Menu
            </div>
            <hr className='cardDivider'/>
            <div className='cardBody'>
              <FlatButton
                linkButton
                href='#app/profile/profile'
                label='Profile'
                secondary
              />
              <br/>
              <FlatButton
                linkButton
                href='#app/profile/workHistory'
                label='Work History'
                secondary
              />
              <br/>
              <FlatButton
                linkButton
                href='#app/profile/license'
                label='License and Certifications'
                secondary
              />
              <br/>
              <FlatButton
                linkButton
                href='#app/profile/specialty'
                label='Specialty'
                secondary
              />
              <br/>
              <FlatButton
                linkButton
                href='#app/profile/schedule'
                label='Work Schedule'
                secondary
              />
              <br/>
              <FlatButton
                linkButton
                href='#app/profile/security'
                label='Security'
                secondary
              />
              <br/>
            </div>
          </div>
        </div>
        <div className='appProfileCards'>
          {this.props.children || <ProfileCard/>}
        </div>
      </div>
    );
  },
});

export default Profile;
