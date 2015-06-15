'use strict';

const AppDispatcher = require('../dispatcher/appDispatcher.js');
const EventEmitter = require('events').EventEmitter;
const CircleConstants = require('../constants/circleOfTrustConstants.js');
const assign = require('object-assign');

let CHANGE_EVENT = 'circle';

let _circleItems = [];

let createCirlce = (reactId, payload) => {
  payload.reactId = reactId;
  _circleItems.push(payload);
};

let updateCircle = (reactId, payload) => {
  for (let i = 0; i < _circleItems.length; i++) {
    if (_circleItems[i].reactId === reactId) {
      _circleItems[i] = assign(_circleItems[i], payload);
    }
  }
};

let deleteId = (reactId) => {
  for (let i = 0; i < _circleItems.length; i++) {
    if (_circleItems[i].reactId === reactId) {
      _circleItems.splice(i, 1);
    }
  }
};

let deleteGuid = (guid, targetGuid) => {
  for (let i = 0; i < _circleItems.length; i++) {
    if (_circleItems[i].guid === guid) {
      let keyArray = Object.keys(_circleItems[i]);
      for (let j = 0; j < keyArray.length; j++) {
        let key = keyArray[j];
        if (_circleItems[i][key] === targetGuid) {
          delete _circleItems[i][key];
        }
      }
    }
  }
};

let updateGuidFromServer = function(reactId, guid) {
  for (let i = 0; i < _circleItems.length; i++) {
    if (_circleItems[i].reactId === reactId) {
      _circleItems[i].guid = guid;
    }
  }
};

let updatePayloadFromServer = function(guid, payload){
  for (let i = 0; i < _circleItems.length; i++) {
    if (_circleItems[i].guid === guid) {
      _circleItems[i] = assign(_circleItems[i], payload);
    }
  }
};

//Circle of trust store
let CircleStore = assign({}, EventEmitter.prototype, {
  getAll () {
    // console.log(_circleItems);
    return _circleItems;
  },

  emitChange (){
    this.emit(CHANGE_EVENT);
  },

  addChangeListener (callback){
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener (callback){
    this.removeListener(CHANGE_EVENT, callback);
  }
});

AppDispatcher.register(function(action){

  switch(action.actionType){

    case CircleConstants.CIRCLE_CREATE:
      createCirlce(action.reactId, action.payload);
      CircleStore.emitChange();
      break;

    case CircleConstants.CIRCLE_UPDATEFROMSERVER:
      updateGuidFromServer(action.reactId, action.serverGuid);
      CircleStore.emitChange();
      break;

    case CircleConstants.CIRCLE_UPDATEPAYLOADFROMSERVER:
      updatePayloadFromServer(action.circleGuid, action.payload);
      CircleStore.emitChange();
      break;

    case CircleConstants.CIRCLE_DESTROY:
      deleteId(action.reactId);
      CircleStore.emitChange();
      break;

    case CircleConstants.CIRCLE_UPDATE:
      updateCircle(action.reactId, action.payload);
      CircleStore.emitChange();
      break;

    case CircleConstants.CIRCLE_DELETEGUID:
      deleteGuid(action.guid, action.targetGuid);
      CircleStore.emitChange();
      break;

    default:
      //no operation
  }

});

module.exports = CircleStore;
