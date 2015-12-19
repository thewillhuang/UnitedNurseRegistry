import React from 'react';
import { TextField, RaisedButton, Snackbar } from 'material-ui';
import user from '../../utils/grabUser.js';
const facilityID = user.scope.facilityID;
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
import facilityApi from '../../webapi/facilityApi.js';
import facilityPhoneApi from '../../webapi/facilityPhoneApi.js';
import geoHashApi from '../../webapi/geoHashApi.js';
import geohash from 'ngeohash';
import facilityAddressApi from '../../webapi/facilityAddressApi.js';

const ProfileCard = React.createClass({
  componentDidMount() {
    facilityApi.getFacilityInfo(facilityID)
    .then(data => {
      console.log(data);
    });
  },

  handleSubmit() {
    const name = this.refs.name.getValue() || null;
    const emr = this.refs.emr.getValue() || null;
    const phone = this.refs.phone.getValue() || null;
    const address = this.refs.address.getValue() || null;
    const city = this.refs.city.getValue() || '';
    const state = this.refs.state.getValue() || '';
    const zip = this.refs.zip.getValue() || '';
    const ext = this.refs.ext.getValue() || null;
    const phoneType = this.refs.phoneType.getValue() || null;
    // const facilityID = user.scope.facilityID;
    const ctx = this;
    async function getGeoHash() {
      try {
        await geoHashApi.addressLatLng(`${address} ${city} ${state} ${zip}`)
        .then(data => {
          console.log(data);
          return geohash.encode(data.lat, data.lng);
        }).then(hash => {
          facilityApi.updateFacilityInfo(user.scope.facilityID, null, name, hash, null, emr);
          ctx.refs.submitted.show();
        });
        await facilityAddressApi.addFacilityAddress(facilityID, address, null, city, state, zip);
      } catch (e) {
        console.log(e);
      }
    }

    async function setPhone() {
      try {
        await facilityPhoneApi.addFacilityPhone(user.scope.facilityID, phone, ext, phoneType);
      } catch (e) {
        console.log(e);
      }
    }

    getGeoHash();
    setPhone();
  },

  render() {
    return (
      <div className='card'>
        <Snackbar
          ref='submitted'
          action='OK'
          message='Hospital Profile Updated'
          autoHideDuration={5000}
        />
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
              hintText='Name'
            />
            <br/>
            <TextField
              ref='emr'
              onEnterKeyDown={this.handleSubmit}
              floatingLabelText='Hospital EMR'
              hintText='EMR'
            />
            <br/>
            <TextField
              ref='phone'
              onEnterKeyDown={this.handleSubmit}
              floatingLabelText='Phone Number'
              hintText='Phone Number'
            />
            <br/>
            <TextField
              ref='ext'
              onEnterKeyDown={this.handleSubmit}
              floatingLabelText='Phone Number ext'
              hintText='Ext'
            />
            <br/>
            <TextField
              ref='phoneType'
              onEnterKeyDown={this.handleSubmit}
              floatingLabelText='Phone Type'
              hintText='Phone Type'
            />
            <br/>
            <TextField
              ref='address'
              onEnterKeyDown={this.handleSubmit}
              floatingLabelText='Address'
              hintText='Address'
            />
            <br/>
            <TextField
              ref='city'
              onEnterKeyDown={this.handleSubmit}
              floatingLabelText='City'
              hintText='City'
            />
            <br/>
            <TextField
              ref='state'
              onEnterKeyDown={this.handleSubmit}
              floatingLabelText='State'
              hintText='State'
            />
            <br/>
            <TextField
              ref='zip'
              onEnterKeyDown={this.handleSubmit}
              floatingLabelText='Zip'
              hintText='Zip'
            />
            <br/>
            <RaisedButton primary label='Upload Facility Images'>
              <input type='file' style={input}></input>
            </RaisedButton>
          </div>
        </div>
      </div>
    );
  },
});

export default ProfileCard;
