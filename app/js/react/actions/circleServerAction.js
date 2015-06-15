// contains all actions from the server side.
'use strict';
const AppDispatcher = require('../dispatcher/appDispatcher.js');
const circleConstants = require('../constants/circleOfTrustConstants.js');
const uuid = require('node-uuid');
const addressApi = require('../webapi/addressApi.js');
const contactsApi = require('../webapi/contactsApi.js');
const $ = require('jquery');

let CircleServerActions = {

  //called from circleApi to create circle of trust list
  createFromServer(payload){
    AppDispatcher.dispatch({
      actionType: circleConstants.CIRCLE_CREATE,
      payload: payload,
      reactId: uuid.v1()
    });
  },

  //update the current element with the associated server guid.
  setGuidFromServer(reactId, serverGuid){
    // console.log('update');
    AppDispatcher.dispatch({
      actionType: circleConstants.CIRCLE_UPDATEFROMSERVER,
      reactId: reactId,
      serverGuid: serverGuid
    });
  },

  setAddressFromServer (circleGuid) {
    //call address api here with circleGuid
    //then call get one address with address and circle guid.
    //then push the payload out and update the components.
    addressApi.getCircleOfTrustProfileAddresses(circleGuid, (payload) => {
      if (payload.addressList){
        // let contactGuidArray = payload.contactMethodGuids.split(',');
        let addressGuidArray = $.parseJSON(payload.addressList);
        // console.log(contactGuidArray);
        for (let i = 0; i < addressGuidArray.length; i++){
          // calls own object function
          CircleServerActions.setOneAddressFromServer(circleGuid, addressGuidArray[i]);
        }
      }
    });

  },

  setOneAddressFromServer (circleGuid, addressGuid) {
    addressApi.getCircleOfTrustAddress(circleGuid, addressGuid, (data) => {

      // console.log('getting address', payload.addressGuids, data);

      let address = {};
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

  setContactFromServer (circleGuid) {
    //call contact api here with circleGuid
    //then call multiple getoneApi here with with contactGuids.
    //then dispatch the payload to the store.
    contactsApi.getCircleOfTrustProfileContactMethods(circleGuid, (payload) => {
      // console.log('getCircleOfTrustProfileContactMethods',payload);
      if (payload.contactMethodList) {
        // let contactGuidArray = payload.contactMethodGuids.split(',');
        let contactGuidArray = $.parseJSON(payload.contactMethodList);
        // console.log(contactGuidArray);
        for (let i = 0; i < contactGuidArray.length; i++){
          // calls own object function
          CircleServerActions.getOneContactFromServer(circleGuid, contactGuidArray[i]);
        }
      }

    });
  },

  // TODO make sure this one works
  getOneContactFromServer (circleGuid, contactGuid){
    contactsApi.getCircleOfTrustContactMethod(circleGuid, contactGuid, (data) => {

      // console.log('getting contact data', contactGuid, data);
      let payload = {};
      payload[data.contactMethodType] = data.contactMethodValue;
      let guid = data.contactMethodType + '.guid';
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
