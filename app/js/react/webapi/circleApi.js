'use strict';
const CircleServerActions = require('../actions/circleServerAction.js');
const ContactApi = require('./contactsApi.js');
const AddressApi = require('./addressApi.js');
const $ = require('jquery');

// takes a payload, url, callback as arguments
const universalPost = require('./universalPost.js');
//execute web api which will get activeProfileGuid and add it to payload then make the ajax

let circleApi = {

  //create new circle of trust item in the server
  create (reactId, payload){
    let url = 'api/circleoftrusts/createcircleoftrustprofile';
    //console.log('create api');
    let profilePhoto = payload.profilePhoto;
    delete payload.profilePhoto;
    universalPost(payload, url, (data) => {
      payload.profilePhoto = profilePhoto;
      let guid = data.guid;
      //call an action to set guid from server, with existing ones
      CircleServerActions.setGuidFromServer(reactId, guid);

      // check if theres an actual guid. (not undefined, '', or null)
      if (guid) {

        //contactMethods apis
        if (payload.mobile || payload.phone || payload.fax || payload.email) {
          if (payload.mobile) {
            ContactApi.createCircleOfTrustContactMethod(guid, 'mobile', payload.mobile, 'mobile', () => {
              // console.log(data);
            });
          }
          if (payload.phone) {
            ContactApi.createCircleOfTrustContactMethod(guid, 'phone', payload.phone, 'phone', () => {
              // console.log(data);
            });
          }
          if (payload.fax) {
            ContactApi.createCircleOfTrustContactMethod(guid, 'fax', payload.fax, 'fax', () => {
              // console.log(data);
            });
          }
          if (payload.email) {
            ContactApi.createCircleOfTrustContactMethod(guid, 'email', payload.email, 'email', () => {
              // console.log(data);
            });
          }
        }

        // //address apis
        if (payload.address || payload.address2 || payload.city || payload.state || payload.zip) {
          AddressApi.createCircleOfTrustAddress(guid, payload.label, payload.address, payload.address2, payload.city, payload.state, payload.zip, () => {
            // console.log(data);
          });
        }

        if (payload.profilePhoto){
          //call the api to send profile photo data to be saved.
          circleApi.uploadProfilePhoto(guid, payload.profilePhoto, () => {
            // console.log(data);
          });
        }

      } else {
        console.log('create failed', data);
      }
    });
  },

  //takes in a circleOfTrustGuid and base 64 encoded image data in string format without the 'data:image/jpeg;charset=utf-8;base64,'
  uploadProfilePhoto (circleOfTrustGuid, photoData, callback){
    let url = 'api/circleoftrusts/uploadcircleoftrustprofilephoto';
    let payload = {};
    payload.circleOfTrustProfileGuid = circleOfTrustGuid;
    payload.photoData = photoData;
    // console.log(photoData);
    universalPost(payload, url, (data) => {
      //console.log('update photo');
      callback(data);
    });
  },

  //grab the profile given a circle of trust guid
  getOne (circleOfTrustGuid){
    //call an action to create list from server
    let url = 'api/circleoftrusts/getcircleoftrustprofile';
    let payload = {};
    payload.circleOfTrustProfileGuid = circleOfTrustGuid;
    //console.log('getOne api');
    universalPost(payload, url, (data) => {
      // console.log(data.guid);
      CircleServerActions.createFromServer(data);
      CircleServerActions.setAddressFromServer(data.guid);
      CircleServerActions.setContactFromServer(data.guid);
    });
  },

  //grab this users's circle of trust List
  getAll (){
    let url = 'api/circleoftrusts/getcircleoftrustprofiles';
    let payload = {};
    //console.log('getAll api');
    universalPost(payload, url, (data) => {
      if (data.profileList) {
        // let circleOfTrustGuidArray = data.profileGuids.split(',');
        let circleOfTrustGuidArray = $.parseJSON(data.profileList);
        for (let i = 0; i < circleOfTrustGuidArray.length; i++){
          // calls get one function
          circleApi.getOne(circleOfTrustGuidArray[i]);
        }
      }
    });
  },

  // delete current circle of trust item from server
  delete (circleOfTrustGuid){
    let url = 'api/circleoftrusts/deletecircleoftrustprofile';
    let payload = {};
    payload.circleOfTrustProfileGuid = circleOfTrustGuid;
    //console.log('delete api');
    universalPost(payload, url, () => {
      // console.log(data);
    });
  },

  // update a circle of trust list item.
  updateCircleOfTrustProfile (circleOfTrustProfileGuid, relationship, title, firstName, middleName, lastName, profileType, profilePhoto, callback) {
    let url = 'api/circleoftrusts/updatecircleoftrustprofile';
    let payload = {};
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
    universalPost(payload, url, (data) => {
      // //console.log('updateCircleOfTrustProfile');
      callback(data);
    });
  },

  //getCircleOfTrustMembership (see all the people whos address book you are in)
  //returns a set of profile guids seperated by ','
  getCircleOfTrustMembership (){
    let url = 'api/circleoftrusts/getcircleoftrustmembership';
    let payload = {};
    //console.log('getCircleOfTrustMembership api');
    universalPost(payload, url, (data) => {
      let dataArray = Object.keys(data);
      for (let i = 0; i < dataArray.length; i++){
        if (dataArray[i].indexOf('@') > -1){
          let email = dataArray[i];
          payload.membership = 'has access';
          payload.email = email;
          CircleServerActions.createFromServer(payload);
        }
      }
    });
  },

  //getPendingUserCircleOfTrustRequests
  getPendingUserCircleOfTrustRequests (){
    let url = 'api/circleoftrusts/getpendingusercircleoftrustrequests';
    let payload = {};
    //console.log('getPendingUserCircleOfTrustRequests api');
    universalPost(payload, url, (data) => {
      let dataArray = Object.keys(data);
      for (let i = 0; i < dataArray.length; i++){
        if (dataArray[i].indexOf('@') > -1){
          let name = data[dataArray[i]].split(',')[0];
          payload.email = dataArray[i];
          payload.membership = 'requests';
          payload.firstName = name;
          CircleServerActions.createFromServer(payload);
        }
      }
    });
  },

  //acceptCircleOfTrustInvitation from an email
  acceptCircleOfTrustInvitation (circleOfTrustEmail){
    let url = 'api/circleoftrusts/acceptcircleoftrustinvitation';
    let payload = {};
    payload.circleOfTrustEmail = circleOfTrustEmail;
    //console.log('acceptCircleOfTrustInvitation api');
    universalPost(payload, url, () => {
      let CircleAction = require('../actions/circleAction.js');
      CircleAction.getFromServer();
    });
  },

  //revokeCircleOfTrustAssociation
  revokeCircleOfTrustAssociation (circleOfTrustEmail){
    let url = 'api/circleoftrusts/revokecircleoftrustassociation';
    let payload = {};
    payload.circleOfTrustEmail = circleOfTrustEmail;
    //console.log('revokeCircleOfTrustAssociation api');
    universalPost(payload, url, () => {
      // no op
    });
  },

  //addCircleOfTrustProfile (add an existing lifespeed member)
  addCircleOfTrustProfile (relationship, title, email, callback){
    let url = 'api/circleoftrusts/addcircleoftrustprofile';
    let payload = {};
    payload.relationship = relationship;
    payload.title = title;
    payload.email = email;
    //console.log('addCircleOfTrustProfile api');
    universalPost(payload, url, (data) => {
      callback(data);
    });
  },

  //getPendingUserCircleOfTrustInvites
  getPendingUserCircleOfTrustInvites (){
    let url = 'api/circleoftrusts/getpendingusercircleoftrustinvites';
    let payload = {};
    //console.log('getPendingUserCircleOfTrustInvites api');
    universalPost(payload, url, (data) => {
      let dataArray = Object.keys(data);
      for (let i = 0; i < dataArray.length; i++){
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
  createCircleOfTrustProfileCompound (profileObj, addressObj, contactMethodObj, callback){
    let url = 'api/circleoftrusts/createcircleoftrustprofilecompound';
    let payload = {};
    payload.CircleOfTrustProfile = JSON.stringify(profileObj);
    payload.AddressList = JSON.stringify(addressObj);
    payload.ContactMethodList = JSON.stringify(contactMethodObj);
    //console.log('createCircleOfTrustProfileCompound');
    universalPost(payload, url, (data) => {
      callback(data);
    });
  },

  getCircleOfTrustProfileCompound (circleOfTrustProfileGuid, callback){
    let url = 'api/circleoftrusts/getcircleoftrustprofilecompound';
    let payload = {};
    payload.circleOfTrustProfileGuid = circleOfTrustProfileGuid;
    //console.log('getCircleOfTrustProfileCompound');
    universalPost(payload, url, (data) => {
      callback(data);
    });
  }

};

module.exports = circleApi;
