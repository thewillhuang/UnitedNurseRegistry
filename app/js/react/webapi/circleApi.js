'use strict';
var CircleServerActions = require('../actions/circleServerAction.js');
var ContactApi = require('./contactsApi.js');
var AddressApi = require('./addressApi.js');
var $ = require('jquery');

// takes a payload, url, callback as arguments
var universalPost = require('./universalPost.js');
//execute web api which will get activeProfileGuid and add it to payload then make the ajax

var circleApi = {

  //create new circle of trust item in the server
  create: function(reactId, payload){
    var url = 'api/circleoftrusts/createcircleoftrustprofile';
    //console.log('create api');
    var profilePhoto = payload.profilePhoto;
    delete payload.profilePhoto;
    universalPost(payload, url, function(data){
      payload.profilePhoto = profilePhoto;
      var guid = data.guid;
      //call an action to set guid from server, with existing ones
      CircleServerActions.setGuidFromServer(reactId, guid);

      // check if theres an actual guid. (not undefined, '', or null)
      if (guid) {

        //contactMethods apis
        if (payload.mobile || payload.phone || payload.fax || payload.email) {
          if (payload.mobile) {
            ContactApi.createCircleOfTrustContactMethod(guid, 'mobile', payload.mobile, 'mobile', function(){
              // console.log(data);
            });
          }
          if (payload.phone) {
            ContactApi.createCircleOfTrustContactMethod(guid, 'phone', payload.phone, 'phone', function(){
              // console.log(data);
            });
          }
          if (payload.fax) {
            ContactApi.createCircleOfTrustContactMethod(guid, 'fax', payload.fax, 'fax', function(){
              // console.log(data);
            });
          }
          if (payload.email) {
            ContactApi.createCircleOfTrustContactMethod(guid, 'email', payload.email, 'email', function(){
              // console.log(data);
            });
          }
        }

        // //address apis
        if (payload.address || payload.address2 || payload.city || payload.state || payload.zip) {
          AddressApi.createCircleOfTrustAddress(guid, payload.label, payload.address, payload.address2, payload.city, payload.state, payload.zip, function(){
            // console.log(data);
          });
        }

        if (payload.profilePhoto){
          //call the api to send profile photo data to be saved.
          circleApi.uploadProfilePhoto(guid, payload.profilePhoto, function(){
            // console.log(data);
          });
        }

      } else {
        console.log('create failed', data);
      }
    });
  },

  //takes in a circleOfTrustGuid and base 64 encoded image data in string format without the 'data:image/jpeg;charset=utf-8;base64,'
  uploadProfilePhoto: function(circleOfTrustGuid, photoData, callback){
    var url = 'api/circleoftrusts/uploadcircleoftrustprofilephoto';
    var payload = {};
    payload.circleOfTrustProfileGuid = circleOfTrustGuid;
    payload.photoData = photoData;
    // console.log(photoData);
    universalPost(payload, url, function(data){
      //console.log('update photo');
      callback(data);
    });
  },

  //grab the profile given a circle of trust guid
  getOne: function(circleOfTrustGuid){
    //call an action to create list from server
    var url = 'api/circleoftrusts/getcircleoftrustprofile';
    var payload = {};
    payload.circleOfTrustProfileGuid = circleOfTrustGuid;
    //console.log('getOne api');
    universalPost(payload, url, function(data){
      // console.log(data.guid);
      CircleServerActions.createFromServer(data);
      CircleServerActions.setAddressFromServer(data.guid);
      CircleServerActions.setContactFromServer(data.guid);
    });
  },

  //grab this users's circle of trust List
  getAll: function(){
    var url = 'api/circleoftrusts/getcircleoftrustprofiles';
    var payload = {};
    //console.log('getAll api');
    universalPost(payload, url, function(data){
      if (data.profileList) {
        // var circleOfTrustGuidArray = data.profileGuids.split(',');
        var circleOfTrustGuidArray = $.parseJSON(data.profileList);
        for (var i = 0; i < circleOfTrustGuidArray.length; i++){
          // calls get one function
          circleApi.getOne(circleOfTrustGuidArray[i]);
        }
      }
    });
  },

  // delete current circle of trust item from server
  delete: function(circleOfTrustGuid){
    var url = 'api/circleoftrusts/deletecircleoftrustprofile';
    var payload = {};
    payload.circleOfTrustProfileGuid = circleOfTrustGuid;
    //console.log('delete api');
    universalPost(payload, url, function(){
      // console.log(data);
    });
  },

  // update a circle of trust list item.
  updateCircleOfTrustProfile: function(circleOfTrustProfileGuid, relationship, title, firstName, middleName, lastName, profileType, profilePhoto, callback) {
    var url = 'api/circleoftrusts/updatecircleoftrustprofile';
    var payload = {};
    payload.circleOfTrustProfileGuid = circleOfTrustProfileGuid;
    payload.relationship = relationship;
    payload.title = title;
    payload.firstName = firstName;
    payload.middleName = middleName;
    payload.lastName = lastName;
    // payload.profileType = profileType;
    // possible bug here
    // payload.profilePhoto = profilePhoto;
    // console.log('update circle of trust profile payload');
    universalPost(payload, url, function(data){
      // //console.log('updateCircleOfTrustProfile');
      callback(data);
    });
  },

  //getCircleOfTrustMembership (see all the people whos address book you are in)
  //returns a set of profile guids seperated by ','
  getCircleOfTrustMembership: function(){
    var url = 'api/circleoftrusts/getcircleoftrustmembership';
    var payload = {};
    //console.log('getCircleOfTrustMembership api');
    universalPost(payload, url, function(data){
      var dataArray = Object.keys(data);
      for (var i = 0; i < dataArray.length; i++){
        if (dataArray[i].indexOf('@') > -1){
          var email = dataArray[i];
          payload.membership = 'has access';
          payload.email = email;
          CircleServerActions.createFromServer(payload);
        }
      }
    });
  },

  //getPendingUserCircleOfTrustRequests
  getPendingUserCircleOfTrustRequests: function(){
    var url = 'api/circleoftrusts/getpendingusercircleoftrustrequests';
    var payload = {};
    //console.log('getPendingUserCircleOfTrustRequests api');
    universalPost(payload, url, function(data){
      var dataArray = Object.keys(data);
      for (var i = 0; i < dataArray.length; i++){
        if (dataArray[i].indexOf('@') > -1){
          var name = data[dataArray[i]].split(',')[0];
          payload.email = dataArray[i];
          payload.membership = 'requests';
          payload.firstName = name;
          CircleServerActions.createFromServer(payload);
        }
      }
    });
  },

  //acceptCircleOfTrustInvitation from an email
  acceptCircleOfTrustInvitation: function(circleOfTrustEmail){
    var url = 'api/circleoftrusts/acceptcircleoftrustinvitation';
    var payload = {};
    payload.circleOfTrustEmail = circleOfTrustEmail;
    //console.log('acceptCircleOfTrustInvitation api');
    universalPost(payload, url, function(){
      var CircleAction = require('../actions/circleAction.js');
      CircleAction.getFromServer();
    });
  },

  //revokeCircleOfTrustAssociation
  revokeCircleOfTrustAssociation: function(circleOfTrustEmail){
    var url = 'api/circleoftrusts/revokecircleoftrustassociation';
    var payload = {};
    payload.circleOfTrustEmail = circleOfTrustEmail;
    //console.log('revokeCircleOfTrustAssociation api');
    universalPost(payload, url, function(){
      // no op
    });
  },

  //addCircleOfTrustProfile (add an existing lifespeed member)
  addCircleOfTrustProfile: function(relationship, title, email, callback){
    var url = 'api/circleoftrusts/addcircleoftrustprofile';
    var payload = {};
    payload.relationship = relationship;
    payload.title = title;
    payload.email = email;
    //console.log('addCircleOfTrustProfile api');
    universalPost(payload, url, function(data){
      callback(data);
    });
  },

  //getPendingUserCircleOfTrustInvites
  getPendingUserCircleOfTrustInvites: function(){
    var url = 'api/circleoftrusts/getpendingusercircleoftrustinvites';
    var payload = {};
    //console.log('getPendingUserCircleOfTrustInvites api');
    universalPost(payload, url, function(data){
      var dataArray = Object.keys(data);
      for (var i = 0; i < dataArray.length; i++){
        if (dataArray[i].indexOf('@') > -1){
          payload.email = dataArray[i];
          payload.membership = 'invites';
          CircleServerActions.createFromServer(payload);
        }
      }
      // console.log(emailArray);
      // console.log(dataArray);
    });
  },

  // takes profile object {relationship, title, firstName, middleName, lastName, profileType}
  // takes addressList object {PrimaryAddress, SecondaryAddress} each containing {label, address, address2, city, state, zip}
  // takes contactMethodList object  {Phone, Email} each contining {label, contactMethodValue, contactMethodType}
  createCircleOfTrustProfileCompound: function(profileObj, addressObj, contactMethodObj, callback){
    var url = 'api/circleoftrusts/createcircleoftrustprofilecompound';
    var payload = {};
    payload.CircleOfTrustProfile = JSON.stringify(profileObj);
    payload.AddressList = JSON.stringify(addressObj);
    payload.ContactMethodList = JSON.stringify(contactMethodObj);
    //console.log('createCircleOfTrustProfileCompound');
    universalPost(payload, url, function(data){
      callback(data);
    });
  },

  getCircleOfTrustProfileCompound: function(circleOfTrustProfileGuid, callback){
    var url = 'api/circleoftrusts/getcircleoftrustprofilecompound';
    var payload = {};
    payload.circleOfTrustProfileGuid = circleOfTrustProfileGuid;
    //console.log('getCircleOfTrustProfileCompound');
    universalPost(payload, url, function(data){
      callback(data);
    });
  }

};

module.exports = circleApi;
