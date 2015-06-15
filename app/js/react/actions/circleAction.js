// contains all the actions that originates from the client side
'use strict';
const AppDispatcher = require('../dispatcher/appDispatcher.js');
const circleConstants = require('../constants/circleOfTrustConstants.js');
const circleApi = require('../webapi/circleApi.js');
const uuid = require('node-uuid');
const addressApi = require('../webapi/addressApi.js');
const contactApi = require('../webapi/contactsApi.js');

let CircleActions = {

  //creates the object payload
  create(payload) {
    let reactId = uuid.v1();
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
  getFromServer() {
    circleApi.getAll();
    // circleApi.getPendingUserCircleOfTrustInvites();
    // circleApi.getPendingUserCircleOfTrustRequests();
    // circleApi.getCircleOfTrustMembership();
  },

  update(state, props) {
    // console.log(payload, props, 'circle action');
    let circleOfTrustProfileGuid = props.payload.guid;
    let reactId = props.payload.reactId;
    let addressGuid = props.payload.addressGuid;

    AppDispatcher.dispatch({
      actionType: circleConstants.CIRCLE_UPDATE,
      reactId: reactId,
      payload: state
    });

    console.log('state', state);
    console.log('props', props);

    circleApi.updateCircleOfTrustProfile(circleOfTrustProfileGuid, state.relationship, state.title, state.firstName, state.middleName, state.lastName, state.profileType, state.profilePhoto, () => {
      // console.log('profile updated', data);
    });

    if (addressGuid) {
      addressApi.updateCircleOfTrustAddress(circleOfTrustProfileGuid, addressGuid, state.label, state.address, state.address2, state.city, state.state, state.zip, () => {
        // console.log('address updated', data);
        // CircleServerActions.setAddressGuidFromServer(circleOfTrustProfileGuid, data);
      });
    }

    if (props.payload['phone.guid']) {
      if (!state.phone) {
        contactApi.deleteCircleOfTrustContactMethod(circleOfTrustProfileGuid, props.payload['phone.guid']);
      } else {
        contactApi.updateCircleOfTrustContactMethod(circleOfTrustProfileGuid, props.payload['phone.guid'], 'phone', state.phone, 'phone', () => {
          // console.log('phone updated', data);
          // CircleServerActions.setContactGuidFromServer(circleOfTrustProfileGuid, data);
        });
      }
    }
    if (props.payload['mobile.guid']) {
      if (!state.mobile) {
        contactApi.deleteCircleOfTrustContactMethod(circleOfTrustProfileGuid, props.payload['mobile.guid']);
      } else {
        contactApi.updateCircleOfTrustContactMethod(circleOfTrustProfileGuid, props.payload['mobile.guid'], 'mobile', state.mobile, 'mobile', () => {
          // console.log('mobile updated', data);
          // CircleServerActions.setContactGuidFromServer(circleOfTrustProfileGuid, data);
        });
      }
    }

    if (props.payload['email.guid']) {
      if (!state.email) {
        contactApi.deleteCircleOfTrustContactMethod(circleOfTrustProfileGuid, props.payload['email.guid'] || props.payload['email.guid']);
      } else {
        contactApi.updateCircleOfTrustContactMethod(circleOfTrustProfileGuid, props.payload['email.guid'] || props.payload['email.guid'], 'email', state.email, 'email', () => {
          // console.log('email updated', data);
          // CircleServerActions.setContactGuidFromServer(circleOfTrustProfileGuid, data);
        });
      }
    }

    if (props.payload['fax.guid']) {
      if (!state.fax) {
        contactApi.deleteCircleOfTrustContactMethod(circleOfTrustProfileGuid, props.payload['fax.guid']);
      } else {
        contactApi.updateCircleOfTrustContactMethod(circleOfTrustProfileGuid, props.payload['fax.guid'], 'fax', state.fax, 'fax', () => {
          // console.log('fax updated', data);
          // CircleServerActions.setContactGuidFromServer(circleOfTrustProfileGuid, data);
        });
      }
    }

    // find fields that are not there to be created
    if (!addressGuid && state.address) {
      addressApi.createCircleOfTrustAddress(circleOfTrustProfileGuid, state.label, state.address, state.address2, state.city, state.state, state.zip, () => {
        // console.log('address created', data);
      });
    }
    if (!props.payload['phone.guid'] && state.phone) {
      contactApi.createCircleOfTrustContactMethod(circleOfTrustProfileGuid, 'phone', state.phone, 'phone', () => {
        // console.log('new phone contact created', data);
      });
    }

    if (!props.payload['mobile.guid'] && state.mobile) {
      contactApi.createCircleOfTrustContactMethod(circleOfTrustProfileGuid, 'mobile', state.mobile, 'mobile', () => {
        // console.log('new mobile contact created', data);
      });
    }
    if (!props.payload['email.guid'] && state.email) {
      contactApi.createCircleOfTrustContactMethod(circleOfTrustProfileGuid, 'email', state.email, 'email', () => {
        // console.log('new email contact created', data);
      });
    }
    if (!props.payload['fax.guid'] && state.fax) {
      contactApi.createCircleOfTrustContactMethod(circleOfTrustProfileGuid, 'fax', state.fax, 'fax', () => {
        // console.log('fax contact created', data);
      });
    }
  },

  updatePhoto(state, props) {
    // console.log(state, props);
    circleApi.uploadProfilePhoto(props.guid, state.profilePhoto, () => {
      // console.log('profle photo updated/added', done);
    });
  },

  destroy(circleOfTrustGuid, reactId) {
    // console.log(circleOfTrustGuid, reactId);

    AppDispatcher.dispatch({
      actionType: circleConstants.CIRCLE_DESTROY,
      reactId: reactId
    });

    //web api to delete
    circleApi.delete(circleOfTrustGuid);
  },

  deleteById(reactId) {
    AppDispatcher.dispatch({
      actionType: circleConstants.CIRCLE_DESTROY,
      reactId: reactId
    });
  },

  request(relationship, title, email) {
    let reactId = uuid.v1();
    let payload = {};
    payload.relationship = relationship;
    payload.title = title;
    payload.email = email;
    payload.membership = 'invites';
    circleApi.addCircleOfTrustProfile(relationship, title, email, (data) => {
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

  acceptMembership(email, reactId) {
    circleApi.acceptCircleOfTrustInvitation(email);
    CircleActions.deleteById(reactId);
  },

  revokeMembership(email, reactId) {
    // console.log(email, reactId);
    circleApi.revokeCircleOfTrustAssociation(email);

    AppDispatcher.dispatch({
      actionType: circleConstants.CIRCLE_DESTROY,
      reactId: reactId
    });
  }

};

module.exports = CircleActions;
