'use strict';

// takes a payload, url, callback as arguments
const universalPost = require('./universalPost.js');
const AppDispatcher = require('../dispatcher/appDispatcher.js');
const circleConstants = require('../constants/circleOfTrustConstants.js');

let contactApi = {

  //given profile guid, return a set of contactMethodGuids split with ' , '
  getProfileContactMethods () {
    let url = 'api/contactmethods/getprofilecontactMethods';
    let payload = {};
    universalPost(payload, url, () => {
      // console.log(data);
    });
  },

  // types that gets checked for validation are any string that contains email, address, phone, mobile, cell, fax
  //given labe(optional), contactMethod value, contact Method type (key), get back a guid (relationshihp? or actual?)
  createContactMethod (label, contactMethodValue, contactMethodType) {
    let url = 'api/contactmethods/createcontactmethod';
    let payload = {};
    payload.label = label;
    payload.contactMethodValue = contactMethodValue;
    payload.contactMethodType = contactMethodType;
    universalPost(payload, url, () => {
    });
  },

  // ContactMethodGuid are given by getProfileContactMethods
  //given contactMethodGuid, return the information saved.
  getContactMethod (contactMethodGuid) {
    let url = 'api/contactmethods/getcontactmethod';
    let payload = {};
    payload.contactMethodGuid = contactMethodGuid;
    universalPost(payload, url, () => {
      // console.log(data);
    });
  },

  //given contactMethodguid, and label (optional), value and type update the database on the server.
  updateContactMethod (contactMethodGuid, label, contactMethodValue, contactMethodType) {
    let url = 'api/contactmethods/updatecontactmethod';
    let payload = {};
    payload.label = label;
    payload.contactMethodValue = contactMethodValue;
    payload.contactMethodType = contactMethodType;
    payload.contactMethodGuid = contactMethodGuid;
    universalPost(payload, url, () => {
      // console.log(data);
    });
  },

  //deleteContactMethod
  deleteContactMethod (contactMethodGuid) {
    let url = 'api/contactmethods/deletecontactmethod';
    let payload = {};
    payload.contactMethodGuid = contactMethodGuid;
    universalPost(payload, url, () => {
      // console.log(data);
    });
  },

  //given a circle of trust profile Guid, return contact contactMethodGuids.
  // contactMethodGuids are given in a long string seperated by ','
  getCircleOfTrustProfileContactMethods (circleOfTrustProfileGuid, callback) {
    let url = 'api/contactmethods/getcircleoftrustprofilecontactmethods';
    let payload = {};
    payload.circleOfTrustProfileGuid = circleOfTrustProfileGuid;
    universalPost(payload, url, (data) => {
      callback(data);
    });
  },

  //given a circle of trust profle guid, and lable (optional), contactMethodValue, contactMethodType(key)
  // retuns a guid ( relationship? or actual )
  createCircleOfTrustContactMethod (circleOfTrustProfileGuid, label, contactMethodValue, contactMethodType, callback) {
    let url = 'api/contactmethods/createcircleoftrustcontactmethod';
    let payload = {};
    payload.circleOfTrustProfileGuid = circleOfTrustProfileGuid;
    payload.label = label;
    payload.contactMethodType = contactMethodType;
    payload.contactMethodValue = contactMethodValue;
    console.log('create circle of trust contacts');
    universalPost(payload, url, (data) => {
      // console.log(data);
      // console.log(data.Success);
      let guid = contactMethodType + '.guid';
      data[guid] = data.guid;
      delete data.guid;
      AppDispatcher.dispatch({
        actionType: circleConstants.CIRCLE_UPDATEPAYLOADFROMSERVER,
        circleGuid: circleOfTrustProfileGuid,
        payload: data
      });

      callback(data);
    });
  },

  // given circle of trust guid and contact method guid, return information.
  getCircleOfTrustContactMethod (circleOfTrustProfileGuid, contactMethodGuid, callback) {
    let url = 'api/contactmethods/getcircleoftrustcontactmethod';
    let payload = {};
    payload.circleOfTrustProfileGuid = circleOfTrustProfileGuid;
    payload.contactMethodGuid = contactMethodGuid;
    universalPost(payload, url, (data) => {
      callback(data);
    });
  },

  // given circle guid, contact guild, label, value, type update the database.
  updateCircleOfTrustContactMethod (circleOfTrustProfileGuid, contactMethodGuid, label, contactMethodValue, contactMethodType, callback) {
    let url = 'api/contactmethods/updatecircleoftrustcontactmethod';
    let payload = {};
    payload.circleOfTrustProfileGuid = circleOfTrustProfileGuid;
    payload.contactMethodGuid = contactMethodGuid;
    payload.label = label;
    payload.contactMethodType = contactMethodType;
    payload.contactMethodValue = contactMethodValue;
    universalPost(payload, url, (data) => {
      callback(data);
    });
  },

  // delete circle of trust conatct given circle guid, contact guid
  deleteCircleOfTrustContactMethod (circleOfTrustProfileGuid, contactMethodGuid) {
    let url = 'api/contactmethods/deletecircleoftrustcontactmethod';
    let payload = {};
    payload.circleOfTrustProfileGuid = circleOfTrustProfileGuid;
    payload.contactMethodGuid = contactMethodGuid;
    universalPost(payload, url, () => {
      // console.log(data);
      AppDispatcher.dispatch({
        actionType: circleConstants.CIRCLE_DELETEGUID,
        guid: circleOfTrustProfileGuid,
        targetGuid: contactMethodGuid
      });
    });
  }

};

module.exports = contactApi;
