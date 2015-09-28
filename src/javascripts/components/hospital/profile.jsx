import React from 'react';
import mui, {FlatButton} from 'material-ui';
import ProfileCard from './profileCard.jsx';
// import ShiftFilter from './shiftFilter.jsx';
// import ShiftHospital from './shiftHospitalTable.jsx';
const ThemeManager = new mui.Styles.ThemeManager();
// const MenuItem = require('material-ui/lib/menus/menu-item');
// const MenuDivider = require('material-ui/lib/menus/menu-divider');
// import MediaQuery from 'react-responsive';

class ProfileList extends React.Component {
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
                linkButton
                href='/#/hospital/profile/profile'
                label='Profile'
                secondary />
              <br/>
              <FlatButton
                linkButton
                href='/#/hospital/profile/security'
                label='Security'
                secondary />
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

export default ProfileList;
