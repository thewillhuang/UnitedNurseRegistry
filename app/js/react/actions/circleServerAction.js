// contains all actions from the server side.
'use strict';
var AppDispatcher = require('../dispatcher/appDispatcher.js');
var circleConstants = require('../constants/circleOfTrustConstants.js');
var uuid = require('node-uuid');
var addressApi = require('../webapi/addressApi.js');
var contactsApi = require('../webapi/contactsApi.js');
var $ = require('jquery');

var CircleServerActions = {

  //called from circleApi to create circle of trust list
  createFromServer: function(payload){
    AppDispatcher.dispatch({
      actionType: circleConstants.CIRCLE_CREATE,
      payload: payload,
      reactId: uuid.v1()
    });
  },

  //update the current element with the associated server guid.
  setGuidFromServer: function(reactId, serverGuid){
    // console.log('update');
    AppDispatcher.dispatch({
      actionType: circleConstants.CIRCLE_UPDATEFROMSERVER,
      reactId: reactId,
      serverGuid: serverGuid
    });
  },

  setAddressFromServer: function(circleGuid) {
    //call address api here with circleGuid
    //then call get one address with address and circle guid.
    //then push the payload out and update the components.
    addressApi.getCircleOfTrustProfileAddresses(circleGuid, function(payload){
      if (payload.addressList){
        // var contactGuidArray = payload.contactMethodGuids.split(',');
        var addressGuidArray = $.parseJSON(payload.addressList);
        // console.log(contactGuidArray);
        for (var i = 0; i < addressGuidArray.length; i++){
          // calls own object function
          CircleServerActions.setOneAddressFromServer(circleGuid, addressGuidArray[i]);
        }
      }
    });

  },

  setOneAddressFromServer: function(circleGuid, addressGuid) {
    addressApi.getCircleOfTrustAddress(circleGuid, addressGuid, function(data){

      // console.log('getting address', payload.addressGuids, data);

      var address = {};
      address.address = data.address;
      address.address2 = data.address2;
      address.city = data.city;
      address.state = data.state;
      address.zip = data.zip;
      address.addressGuid = data.guid;

      AppDispatcher.dispatch({
        actionType: circleConstants.CIRCLE_UPDATEPAYLOADFROMSERVER,
        circleGuid: circleGuid,
        payload: address
      });

    });
  },

  setContactFromServer: function(circleGuid) {
    //call contact api here with circleGuid
    //then call multiple getoneApi here with with contactGuids.
    //then dispatch the payload to the store.
    contactsApi.getCircleOfTrustProfileContactMethods(circleGuid, function(payload){
      // console.log('getCircleOfTrustProfileContactMethods',payload);
      if (payload.contactMethodList) {
        // var contactGuidArray = payload.contactMethodGuids.split(',');
        var contactGuidArray = $.parseJSON(payload.contactMethodList);
        // console.log(contactGuidArray);
        for (var i = 0; i < contactGuidArray.length; i++){
          // calls own object function
          CircleServerActions.getOneContactFromServer(circleGuid, contactGuidArray[i]);
        }
      }

    });
  },

  // TODO make sure this one works
  getOneContactFromServer: function(circleGuid, contactGuid){
    contactsApi.getCircleOfTrustContactMethod(circleGuid, contactGuid, function(data){

      // console.log('getting contact data', contactGuid, data);
      var payload = {};
      payload[data.contactMethodType] = data.contactMethodValue;
      var guid = data.contactMethodType + '.guid';
      payload[guid] = data.guid;

      AppDispatcher.dispatch({
        actionType: circleConstants.CIRCLE_UPDATEPAYLOADFROMSERVER,
        circleGuid: circleGuid,
        payload: payload
      });

    });
  }

};

module.exports = CircleServerActions;
