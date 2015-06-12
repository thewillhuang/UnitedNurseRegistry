// contains all the actions that originates from the client side
'use strict';
var AppDispatcher = require('../dispatcher/appDispatcher.js');
var circleConstants = require('../constants/circleOfTrustConstants.js');
var circleApi = require('../webapi/circleApi.js');
var uuid = require('node-uuid');
var addressApi = require('../webapi/addressApi.js');
var contactApi = require('../webapi/contactsApi.js');

var CircleActions = {

  //creates the object payload
  create: function(payload) {
    var reactId = uuid.v1();
    payload.title = payload.title || null;
    payload.middleName = payload.middleName || null;
    payload.profileType = payload.profileType || null;
    payload.profilePhoto = payload.profilePhoto || null;
    payload.member = 'false';

    // console.log(payload);
    //dispatch payload to re-render ui.
    AppDispatcher.dispatch({
      actionType: circleConstants.CIRCLE_CREATE,
      payload: payload,
      reactId: reactId
    });

    //call the api to make the same object on the server
    circleApi.create(reactId, payload);

  },

  //web api to get self made contact list from the server
  getFromServer: function() {
    circleApi.getAll();
    // circleApi.getPendingUserCircleOfTrustInvites();
    // circleApi.getPendingUserCircleOfTrustRequests();
    // circleApi.getCircleOfTrustMembership();
  },

  update: function(payload, props) {
    // console.log(payload, props, 'circle action');
    var circleOfTrustProfileGuid = props.payload.guid;
    var reactId = props.payload.reactId;
    var addressGuid = props.payload.addressGuid;

    AppDispatcher.dispatch({
      actionType: circleConstants.CIRCLE_UPDATE,
      reactId: reactId,
      payload: payload
    });

    console.log(props);

    circleApi.updateCircleOfTrustProfile(circleOfTrustProfileGuid, payload.relationship, payload.title, payload.firstName, payload.middleName, payload.lastName, payload.profileType, payload.profilePhoto, function() {
      // console.log('profile updated', data);
    });

    if (addressGuid) {
      addressApi.updateCircleOfTrustAddress(circleOfTrustProfileGuid, addressGuid, payload.label, payload.address, payload.address2, payload.city, payload.state, payload.zip, function() {
        // console.log('address updated', data);
        // CircleServerActions.setAddressGuidFromServer(circleOfTrustProfileGuid, data);
      });
    }

    if (props.payload['phone.guid']) {
      if (!payload.phone) {
        contactApi.deleteCircleOfTrustContactMethod(circleOfTrustProfileGuid, props.payload['phone.guid']);
      } else if (payload.phone !== props.payload.phone){
        contactApi.updateCircleOfTrustContactMethod(circleOfTrustProfileGuid, props.payload['phone.guid'], 'phone', payload.phone, 'phone', function() {
          // console.log('phone updated', data);
          // CircleServerActions.setContactGuidFromServer(circleOfTrustProfileGuid, data);
        });
      }
    }
    if (props.payload['mobile.guid']) {
      if (!payload.mobile) {
        contactApi.deleteCircleOfTrustContactMethod(circleOfTrustProfileGuid, props.payload['mobile.guid']);
      } else if (payload.mobile !== props.payload.mobile){
        contactApi.updateCircleOfTrustContactMethod(circleOfTrustProfileGuid, props.payload['mobile.guid'], 'mobile', payload.mobile, 'mobile', function() {
          // console.log('mobile updated', data);
          // CircleServerActions.setContactGuidFromServer(circleOfTrustProfileGuid, data);
        });
      }
    }

    if (props.payload['email.guid']) {
      if (!payload.email) {
        contactApi.deleteCircleOfTrustContactMethod(circleOfTrustProfileGuid, props.payload['email.guid'] || props.payload['email.guid']);
      } else if (payload.phone !== props.payload.email){
        contactApi.updateCircleOfTrustContactMethod(circleOfTrustProfileGuid, props.payload['email.guid'] || props.payload['email.guid'], 'email', payload.email, 'email', function() {
          // console.log('email updated', data);
          // CircleServerActions.setContactGuidFromServer(circleOfTrustProfileGuid, data);
        });
      }
    }

    if (props.payload['fax.guid']) {
      if (!payload.fax) {
        contactApi.deleteCircleOfTrustContactMethod(circleOfTrustProfileGuid, props.payload['fax.guid']);
      } else if (payload.fax !== props.payload.fax){
        contactApi.updateCircleOfTrustContactMethod(circleOfTrustProfileGuid, props.payload['fax.guid'], 'fax', payload.fax, 'fax', function() {
          // console.log('fax updated', data);
          // CircleServerActions.setContactGuidFromServer(circleOfTrustProfileGuid, data);
        });
      }
    }

    // find fields that are not there to be created
    if (!addressGuid && payload.address) {
      addressApi.createCircleOfTrustAddress(circleOfTrustProfileGuid, payload.label, payload.address, payload.address2, payload.city, payload.state, payload.zip, function() {
        // console.log('address created', data);
      });
    }
    if (!props.payload['phone.guid'] && payload.phone) {
      contactApi.createCircleOfTrustContactMethod(circleOfTrustProfileGuid, 'phone', payload.phone, 'phone', function() {
        // console.log('new phone contact created', data);
      });
    }

    if (!props.payload['mobile.guid'] && payload.mobile) {
      contactApi.createCircleOfTrustContactMethod(circleOfTrustProfileGuid, 'mobile', payload.mobile, 'mobile', function() {
        // console.log('new mobile contact created', data);
      });
    }
    if (!props.payload['email.guid'] && payload.email) {
      contactApi.createCircleOfTrustContactMethod(circleOfTrustProfileGuid, 'email', payload.email, 'email', function() {
        // console.log('new email contact created', data);
      });
    }
    if (!props.payload['fax.guid'] && payload.fax) {
      contactApi.createCircleOfTrustContactMethod(circleOfTrustProfileGuid, 'fax', payload.fax, 'fax', function() {
        // console.log('fax contact created', data);
      });
    }
  },

  updatePhoto: function(state, props) {
    // console.log(state, props);
    circleApi.uploadProfilePhoto(props.guid, state.profilePhoto, function() {
      // console.log('profle photo updated/added', done);
    });
  },

  destroy: function(circleOfTrustGuid, reactId) {
    // console.log(circleOfTrustGuid, reactId);

    AppDispatcher.dispatch({
      actionType: circleConstants.CIRCLE_DESTROY,
      reactId: reactId
    });

    //web api to delete
    circleApi.delete(circleOfTrustGuid);
  },

  deleteById: function(reactId) {
    AppDispatcher.dispatch({
      actionType: circleConstants.CIRCLE_DESTROY,
      reactId: reactId
    });
  },

  request: function(relationship, title, email) {
    var reactId = uuid.v1();
    var payload = {};
    payload.relationship = relationship;
    payload.title = title;
    payload.email = email;
    payload.membership = 'invites';
    circleApi.addCircleOfTrustProfile(relationship, title, email, function(data) {
      // console.log(data);
      //on success, add the item.
      if (!data.Error) {
        AppDispatcher.dispatch({
          actionType: circleConstants.CIRCLE_CREATE,
          payload: payload,
          reactId: reactId
        });
      }
      // else {
      //   // console.log('no such member');
      // }
    });
  },

  acceptMembership: function(email, reactId) {
    circleApi.acceptCircleOfTrustInvitation(email);
    CircleActions.deleteById(reactId);
  },

  revokeMembership: function(email, reactId) {
    // console.log(email, reactId);
    circleApi.revokeCircleOfTrustAssociation(email);

    AppDispatcher.dispatch({
      actionType: circleConstants.CIRCLE_DESTROY,
      reactId: reactId
    });
  }

};

module.exports = CircleActions;
