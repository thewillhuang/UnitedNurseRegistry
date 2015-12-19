import React from 'react';
import { FlatButton } from 'material-ui';
import ProfileCard from './profileCard.jsx';

const ProfileList = React.createClass({

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
                href='#hospital/profile/profile'
                label='Profile'
                secondary
              />
              <br/>
              <FlatButton
                linkButton
                href='#hospital/profile/security'
                label='Security'
                secondary
              />
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

export default ProfileList;
