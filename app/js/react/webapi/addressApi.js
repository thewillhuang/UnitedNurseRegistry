'use strict';
// takes a payload, url, callback as arguments
const universalPost = require('./universalPost.js');
const AppDispatcher = require('../dispatcher/appDispatcher.js');
const circleConstants = require('../constants/circleOfTrustConstants.js');

let addressApi = {

  //given profile guid, return a set of address guid split with ' , '
  getProfileAddresses (){
    let url = 'api/addresses/getprofileaddresses';
    let payload = {};
    universalPost(payload, url, () => {
      //console.log(data);
    });
  },

  //given label(optional), address2(optional) address, city, state, zip
  createAddress (label, address, address2, city, state, zip){
    let url = 'api/addresses/createaddress';
    let payload = {};
    payload.label = label;
    payload.address = address;
    payload.address2 = address2;
    payload.city = city;
    payload.state = state;
    payload.zip = zip;
    universalPost(payload, url, () => {
      //console.log(data);
    });
  },

  // addressGuids  are given by getProfileAddresses
  //given addressGuid, return the information saved.
  getAddress (addressGuid){
    let url = 'api/addresses/getaddress';
    let payload = {};
    payload.addressGuid = addressGuid;
    universalPost(payload, url, () => {
      //console.log(data);
    });
  },

  //given contactMethodguid, and label (optional), value and type update the database on the server.
  updateAddress (addressGuid, label, address, address2, city, state, zip){
    let url = 'api/addresses/updateaddress';
    let payload = {};
    payload.label = label;
    payload.addressGuid = addressGuid;
    payload.address = address;
    payload.address2 = address2;
    payload.city = city;
    payload.state = state;
    payload.zip = zip;
    universalPost(payload, url, () => {
      //console.log(data);
    });
  },

  //deleteContactMethod given an address guid.
  deleteAddress (addressGuid){
    let url = 'api/addresses/deleteaddress';
    let payload = {};
    payload.addressGuid = addressGuid;
    universalPost(payload, url, () => {
      //console.log(data);
    });
  },

  //given a circle of trust profile Guid, return contact addressGuid.
  // addressGuid are given in a long string seperated by ','
  getCircleOfTrustProfileAddresses (circleOfTrustProfileGuid, callback){
    let url = 'api/addresses/getcircleoftrustprofileaddresses';
    let payload = {};
    payload.circleOfTrustProfileGuid = circleOfTrustProfileGuid;
    //console.log('getCircleOfTrustProfileAddresses');
    universalPost(payload, url, (data) => {
      callback(data);
    });
  },

  //given a circle of trust profle guid, and lable (optional), address2(optional), address, address2, city, state, zip
  // retuns a guid ( relationship? or actual)
  createCircleOfTrustAddress (circleOfTrustProfileGuid, label, address, address2, city, state, zip, callback){
    let url = 'api/addresses/createcircleoftrustaddress';
    let payload = {};
    payload.circleOfTrustProfileGuid = circleOfTrustProfileGuid;
    payload.label = label;
    payload.address = address;
    payload.address2 = address2;
    payload.city = city;
    payload.state = state;
    payload.zip = zip;
    //console.log('createCircleOfTrustAddress');
    universalPost(payload, url, (data) => {
      console.log(data);
      data.addressGuid = data.guid;
      delete data.guid;
      console.log(data);
      AppDispatcher.dispatch({
        actionType: circleConstants.CIRCLE_UPDATEPAYLOADFROMSERVER,
        circleGuid: circleOfTrustProfileGuid,
        payload: data
      });

      callback(data);
    });
  },

  // given circle of trust guid and contact method guid, return information.
  getCircleOfTrustAddress (circleOfTrustProfileGuid, addressGuid, callback){
    let url = 'api/addresses/getcircleoftrustaddress';
    let payload = {};
    payload.circleOfTrustProfileGuid = circleOfTrustProfileGuid;
    payload.addressGuid = addressGuid;
    //console.log('getCircleOfTrustAddress');
    universalPost(payload, url, (data) => {
      callback(data);
    });
  },

  // given circle guid, address guild, lable (optional), address2(optional), address, address2, city, state, zip. update the database.
  updateCircleOfTrustAddress (circleOfTrustProfileGuid, addressGuid, label, address, address2, city, state, zip, callback){
    let url = 'api/addresses/updatecircleoftrustaddress';
    let payload = {};
    payload.circleOfTrustProfileGuid = circleOfTrustProfileGuid;
    payload.addressGuid = addressGuid;
    payload.address = address;
    payload.address2 = address2;
    payload.city = city;
    payload.state = state;
    payload.zip = zip;
    universalPost(payload, url, (data) => {
      //console.log(data);
      callback(data);
    });
  },

  // delete circle of trust address given circle guid, address guid
  deleteCircleOfTrustAddress (circleOfTrustProfileGuid, addressGuid){
    let url = 'api/addresses/deletecircleoftrustaddress';
    let payload = {};
    payload.circleOfTrustProfileGuid = circleOfTrustProfileGuid;
    payload.addressGuid = addressGuid;
    universalPost(payload, url, () => {
      //console.log(data);
    });
  }

};

module.exports = addressApi;
