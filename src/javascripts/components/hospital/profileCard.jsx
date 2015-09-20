import React from 'react';
import mui, {TextField, RaisedButton} from 'material-ui';
const ThemeManager = new mui.Styles.ThemeManager();
const input = {
  cursor: 'pointer',
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  width: '100%',
  opacity: 0,
};

import user from '../../utils/grabUser.js';
import facilityApi from '../../actions/webapi/facilityApi.js';
import geoHashApi from '../../actions/webapi/geoHashApi.js';
import geohash from 'ngeohash';

class ProfileCard extends React.Component {
  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  }

  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }

  componentDidMount() {
    facilityApi.getFacilityInfo(user.scope.facilityID)
    .then(data=> {
      console.log(data);
    });
  }

  handleSubmit = () => {
    const name = this.refs.name.getValue() || null;
    const emr = this.refs.emr.getValue() || null;
    const phone = this.refs.phone.getValue() || null;
    const address = this.refs.address.getValue() || null;
    const email = this.refs.email.getValue() || null;

    async function getGeoHash() {
      try {
        return await geoHashApi.addressLatLng(address)
        .then(data=> {
          console.log(data);
          return geohash.encode(data.lat, data.lng);
        }).then(hash=> {
          facilityApi.updateFacilityInfo(user.scope.facilityID, email, name, hash, null, emr);
        });
      } catch (e) {
        console.log(e);
      }
    }

    getGeoHash();
  }

  render() {
    return (
      <div className='card'>
        <div className='cardTitle'>
          Profile
        </div>
        <hr className='cardDivider' />
        <div className='cardBody'>
          <div className='profileCardInputWrap'>
            <TextField
              ref='name'
              floatingLabelText='Hospital Name'
              onEnterKeyDown={this.handleSubmit}
              hintText='Name' />
            <RaisedButton primary label='Upload Facility Images'>
              <input type='file' style={input}></input>
            </RaisedButton>
            <br/>
            <TextField
              ref='emr'
              onEnterKeyDown={this.handleSubmit}
              floatingLabelText='Hospital EMR'
              hintText='EMR' />
            <br/>
            <TextField
              ref='email'
              onEnterKeyDown={this.handleSubmit}
              floatingLabelText='Update Email'
              hintText='Email' />
            <br/>
            <TextField
              ref='phone'
              onEnterKeyDown={this.handleSubmit}
              floatingLabelText='Phone Number'
              hintText='Phone Number' />
            <br/>
            <TextField
              ref='address'
              onEnterKeyDown={this.handleSubmit}
              floatingLabelText='Address'
              hintText='Address' />
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileCard;
