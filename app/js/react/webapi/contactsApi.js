'use strict';

// takes a payload, url, callback as arguments
var universalPost = require('./universalPost.js');
var AppDispatcher = require('../dispatcher/appDispatcher.js');
var circleConstants = require('../constants/circleOfTrustConstants.js');

var contactApi = {

  //given profile guid, return a set of contactMethodGuids split with ' , '
  getProfileContactMethods: function() {
    var url = 'api/contactmethods/getprofilecontactMethods';
    var payload = {};
    universalPost(payload, url, function() {
      // console.log(data);
    });
  },

  // types that gets checked for validation are any string that contains email, address, phone, mobile, cell, fax
  //given labe(optional), contactMethod value, contact Method type (key), get back a guid (relationshihp? or actual?)
  createContactMethod: function(label, contactMethodValue, contactMethodType) {
    var url = 'api/contactmethods/createcontactmethod';
    var payload = {};
    payload.label = label;
    payload.contactMethodValue = contactMethodValue;
    payload.contactMethodType = contactMethodType;
    universalPost(payload, url, function() {
    });
  },

  // ContactMethodGuid are given by getProfileContactMethods
  //given contactMethodGuid, return the information saved.
  getContactMethod: function(contactMethodGuid) {
    var url = 'api/contactmethods/getcontactmethod';
    var payload = {};
    payload.contactMethodGuid = contactMethodGuid;
    universalPost(payload, url, function() {
      // console.log(data);
    });
  },

  //given contactMethodguid, and label (optional), value and type update the database on the server.
  updateContactMethod: function(contactMethodGuid, label, contactMethodValue, contactMethodType) {
    var url = 'api/contactmethods/updatecontactmethod';
    var payload = {};
    payload.label = label;
    payload.contactMethodValue = contactMethodValue;
    payload.contactMethodType = contactMethodType;
    payload.contactMethodGuid = contactMethodGuid;
    universalPost(payload, url, function() {
      // console.log(data);
    });
  },

  //deleteContactMethod
  deleteContactMethod: function(contactMethodGuid) {
    var url = 'api/contactmethods/deletecontactmethod';
    var payload = {};
    payload.contactMethodGuid = contactMethodGuid;
    universalPost(payload, url, function() {
      // console.log(data);
    });
  },

  //given a circle of trust profile Guid, return contact contactMethodGuids.
  // contactMethodGuids are given in a long string seperated by ','
  getCircleOfTrustProfileContactMethods: function(circleOfTrustProfileGuid, callback) {
    var url = 'api/contactmethods/getcircleoftrustprofilecontactmethods';
    var payload = {};
    payload.circleOfTrustProfileGuid = circleOfTrustProfileGuid;
    universalPost(payload, url, function(data) {
      callback(data);
    });
  },

  //given a circle of trust profle guid, and lable (optional), contactMethodValue, contactMethodType(key)
  // retuns a guid ( relationship? or actual )
  createCircleOfTrustContactMethod: function(circleOfTrustProfileGuid, label, contactMethodValue, contactMethodType, callback) {
    var url = 'api/contactmethods/createcircleoftrustcontactmethod';
    var payload = {};
    payload.circleOfTrustProfileGuid = circleOfTrustProfileGuid;
    payload.label = label;
    payload.contactMethodType = contactMethodType;
    payload.contactMethodValue = contactMethodValue;
    console.log('create circle of trust contacts');
    universalPost(payload, url, function(data) {
      // console.log(data);
      // console.log(data.Success);
      var guid = contactMethodType + '.guid';
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
  getCircleOfTrustContactMethod: function(circleOfTrustProfileGuid, contactMethodGuid, callback) {
    var url = 'api/contactmethods/getcircleoftrustcontactmethod';
    var payload = {};
    payload.circleOfTrustProfileGuid = circleOfTrustProfileGuid;
    payload.contactMethodGuid = contactMethodGuid;
    universalPost(payload, url, function(data) {
      callback(data);
    });
  },

  // given circle guid, contact guild, label, value, type update the database.
  updateCircleOfTrustContactMethod: function(circleOfTrustProfileGuid, contactMethodGuid, label, contactMethodValue, contactMethodType, callback) {
    var url = 'api/contactmethods/updatecircleoftrustcontactmethod';
    var payload = {};
    payload.circleOfTrustProfileGuid = circleOfTrustProfileGuid;
    payload.contactMethodGuid = contactMethodGuid;
    payload.label = label;
    payload.contactMethodType = contactMethodType;
    payload.contactMethodValue = contactMethodValue;
    universalPost(payload, url, function(data) {
      callback(data);
    });
  },

  // delete circle of trust conatct given circle guid, contact guid
  deleteCircleOfTrustContactMethod: function(circleOfTrustProfileGuid, contactMethodGuid) {
    var url = 'api/contactmethods/deletecircleoftrustcontactmethod';
    var payload = {};
    payload.circleOfTrustProfileGuid = circleOfTrustProfileGuid;
    payload.contactMethodGuid = contactMethodGuid;
    universalPost(payload, url, function() {
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
