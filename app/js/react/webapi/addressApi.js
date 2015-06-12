'use strict';
// takes a payload, url, callback as arguments
var universalPost = require('./universalPost.js');
var AppDispatcher = require('../dispatcher/appDispatcher.js');
var circleConstants = require('../constants/circleOfTrustConstants.js');

var addressApi = {

  //given profile guid, return a set of address guid split with ' , '
  getProfileAddresses: function(){
    var url = 'api/addresses/getprofileaddresses';
    var payload = {};
    universalPost(payload, url, function(){
      //console.log(data);
    });
  },

  //given label(optional), address2(optional) address, city, state, zip
  createAddress: function(label, address, address2, city, state, zip){
    var url = 'api/addresses/createaddress';
    var payload = {};
    payload.label = label;
    payload.address = address;
    payload.address2 = address2;
    payload.city = city;
    payload.state = state;
    payload.zip = zip;
    universalPost(payload, url, function(){
      //console.log(data);
    });
  },

  // addressGuids  are given by getProfileAddresses
  //given addressGuid, return the information saved.
  getAddress: function(addressGuid){
    var url = 'api/addresses/getaddress';
    var payload = {};
    payload.addressGuid = addressGuid;
    universalPost(payload, url, function(){
      //console.log(data);
    });
  },

  //given contactMethodguid, and label (optional), value and type update the database on the server.
  updateAddress: function(addressGuid, label, address, address2, city, state, zip){
    var url = 'api/addresses/updateaddress';
    var payload = {};
    payload.label = label;
    payload.addressGuid = addressGuid;
    payload.address = address;
    payload.address2 = address2;
    payload.city = city;
    payload.state = state;
    payload.zip = zip;
    universalPost(payload, url, function(){
      //console.log(data);
    });
  },

  //deleteContactMethod given an address guid.
  deleteAddress: function(addressGuid){
    var url = 'api/addresses/deleteaddress';
    var payload = {};
    payload.addressGuid = addressGuid;
    universalPost(payload, url, function(){
      //console.log(data);
    });
  },

  //given a circle of trust profile Guid, return contact addressGuid.
  // addressGuid are given in a long string seperated by ','
  getCircleOfTrustProfileAddresses: function(circleOfTrustProfileGuid, callback){
    var url = 'api/addresses/getcircleoftrustprofileaddresses';
    var payload = {};
    payload.circleOfTrustProfileGuid = circleOfTrustProfileGuid;
    //console.log('getCircleOfTrustProfileAddresses');
    universalPost(payload, url, function(data){
      callback(data);
    });
  },

  //given a circle of trust profle guid, and lable (optional), address2(optional), address, address2, city, state, zip
  // retuns a guid ( relationship? or actual)
  createCircleOfTrustAddress: function(circleOfTrustProfileGuid, label, address, address2, city, state, zip, callback){
    var url = 'api/addresses/createcircleoftrustaddress';
    var payload = {};
    payload.circleOfTrustProfileGuid = circleOfTrustProfileGuid;
    payload.label = label;
    payload.address = address;
    payload.address2 = address2;
    payload.city = city;
    payload.state = state;
    payload.zip = zip;
    //console.log('createCircleOfTrustAddress');
    universalPost(payload, url, function(data){
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
  getCircleOfTrustAddress: function(circleOfTrustProfileGuid, addressGuid, callback){
    var url = 'api/addresses/getcircleoftrustaddress';
    var payload = {};
    payload.circleOfTrustProfileGuid = circleOfTrustProfileGuid;
    payload.addressGuid = addressGuid;
    //console.log('getCircleOfTrustAddress');
    universalPost(payload, url, function(data){
      callback(data);
    });
  },

  // given circle guid, address guild, lable (optional), address2(optional), address, address2, city, state, zip. update the database.
  updateCircleOfTrustAddress: function(circleOfTrustProfileGuid, addressGuid, label, address, address2, city, state, zip, callback){
    var url = 'api/addresses/updatecircleoftrustaddress';
    var payload = {};
    payload.circleOfTrustProfileGuid = circleOfTrustProfileGuid;
    payload.addressGuid = addressGuid;
    payload.address = address;
    payload.address2 = address2;
    payload.city = city;
    payload.state = state;
    payload.zip = zip;
    universalPost(payload, url, function(data){
      //console.log(data);
      callback(data);
    });
  },

  // delete circle of trust address given circle guid, address guid
  deleteCircleOfTrustAddress: function(circleOfTrustProfileGuid, addressGuid){
    var url = 'api/addresses/deletecircleoftrustaddress';
    var payload = {};
    payload.circleOfTrustProfileGuid = circleOfTrustProfileGuid;
    payload.addressGuid = addressGuid;
    universalPost(payload, url, function(){
      //console.log(data);
    });
  }

};

module.exports = addressApi;
