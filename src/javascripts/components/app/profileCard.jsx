import React from 'react';
import {TextField, RaisedButton} from 'material-ui';
import geoHashApi from '../../webapi/geoHashApi.js';
import geohash from 'ngeohash';
import userAddressApi from '../../webapi/userAddressApi.js';
import user from '../../utils/grabUser.js';
import userApi from '../../webapi/userApi.js';
import userPhoneApi from '../../webapi/userPhoneApi.js';
// const ThemeManager = new mui.Styles.ThemeManager();
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

export default class ProfileCard extends React.Component {

  handleSubmit = () => {
    const address = this.refs.address.getValue() || null;
    const city = this.refs.city.getValue() || '';
    const state = this.refs.state.getValue() || '';
    const zip = this.refs.zip.getValue() || '';
    const firstName = this.refs.fName.getValue() || '';
    const middleName = this.refs.mName.getValue() || '';
    const lastName = this.refs.lName.getValue() || '';
    const dob = this.refs.dob.getValue() || '';
    const phoneNumber = this.refs.phone.getValue() || '';
    // const ssn = this.refs.ssn.getValue() || '';
    async function getGeoHash() {
      const latlng = await geoHashApi.addressLatLng(`${address} ${city} ${state} ${zip}`);
      const geoHash = geohash.encode(latlng.lat, latlng.lng);
      await userAddressApi.createUserAddress(user.scope.userID, address, null, city, state, zip, geoHash);
      await userApi.updateUser(user.scope.userID, firstName, lastName, middleName, null, null, geoHash, dob);
      await userPhoneApi.createUserPhone(user.scope.userID, phoneNumber, null, null);
    }
    getGeoHash();
  }

  static childContextTypes = {
    muiTheme: React.PropTypes.object,
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
              onEnterKeyDown={this.handleSubmit}
              ref='fName'
              floatingLabelText='First Name'
              hintText='First Name' />
            <br/>
            <TextField
              onEnterKeyDown={this.handleSubmit}
              ref='mName'
              floatingLabelText='Middle Name'
              hintText='Middle Name' />
            <br/>
            <TextField
              onEnterKeyDown={this.handleSubmit}
              ref='lName'
              floatingLabelText='Last Name'
              hintText='Last Name' />
            <br/>
            <TextField
              onEnterKeyDown={this.handleSubmit}
              ref='dob'
              floatingLabelText='Date of Birth'
              hintText='Date of Birth' />
            <br/>
            <TextField
              onEnterKeyDown={this.handleSubmit}
              ref='phone'
              floatingLabelText='Phone Number'
              hintText='Phone Number' />
            <br/>
            <TextField
              onEnterKeyDown={this.handleSubmit}
              ref='ssn'
              floatingLabelText='Social Security Number'
              hintText='Social Security Number' />
            <br/>
            <TextField
              onEnterKeyDown={this.handleSubmit}
              ref='address'
              floatingLabelText='Address'
              hintText='Address' />
            <br/>
            <TextField
              onEnterKeyDown={this.handleSubmit}
              ref='city'
              floatingLabelText='City'
              hintText='City' />
            <br/>
            <TextField
              onEnterKeyDown={this.handleSubmit}
              ref='state'
              floatingLabelText='State'
              hintText='State' />
            <br/>
            <TextField
              onEnterKeyDown={this.handleSubmit}
              ref='zip'
              floatingLabelText='Zip'
              hintText='Zip' />
            <br/>
            <a href='/api/auth/stripe' className='stripe-connect'><span>Connect with Stripe</span></a>
            <br/>
            <RaisedButton primary label='Choose an Image'>
              <input type='file' style={input}></input>
            </RaisedButton>

          </div>
        </div>
      </div>
    );
  }
}
