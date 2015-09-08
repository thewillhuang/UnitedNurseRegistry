

import React from 'react';
import mui, {FlatButton} from 'material-ui';
import ProfileCard from './ProfileCard.jsx';
// import ShiftFilter from './shiftFilter.jsx';
// import ShiftHospital from './shiftHospitalTable.jsx';
const ThemeManager = new mui.Styles.ThemeManager();
// const MenuItem = require('material-ui/lib/menus/menu-item');
// const MenuDivider = require('material-ui/lib/menus/menu-divider');
// import MediaQuery from 'react-responsive';

class Profile extends React.Component {
  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }

  static propTypes = {
    children: React.PropTypes.node,
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  }
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
                linkButton={true}
                href='/#/app/profile/profile'
                label='Profile'
                secondary={true} />
              <br/>
              <FlatButton
                linkButton={true}
                href='/#/app/profile/workHistory'
                label='Work History'
                secondary={true} />
              <br/>
              <FlatButton
                linkButton={true}
                href='/#/app/profile/license'
                label='License and Certifications'
                secondary={true} />
              <br/>
              <FlatButton
                linkButton={true}
                href='/#/app/profile/specialty'
                label='Specialty'
                secondary={true} />
              <br/>
              <FlatButton
                linkButton={true}
                href='/#/app/profile/schedule'
                label='Work Schedule'
                secondary={true} />
              <br/>
              <FlatButton
                linkButton={true}
                href='/#/app/profile/security'
                label='Security'
                secondary={true} />
              <br/>
            </div>
          </div>
        </div>
        <div className='appProfileCards'>
          {this.props.children || <ProfileCard/>}
        </div>
      </div>
    );
  }
}

export default Profile;
