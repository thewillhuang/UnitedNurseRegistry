'use strict';

var AppDispatcher = require('../dispatcher/appDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var CircleConstants = require('../constants/circleOfTrustConstants.js');
var assign = require('object-assign');

var CHANGE_EVENT = 'circle';

var _circleItems = [];

var createCirlce = function(reactId, payload){
  payload.reactId = reactId;
  _circleItems.push(payload);
};

var updateCircle = function(reactId, payload){
  for (var i = 0; i < _circleItems.length; i++) {
    if (_circleItems[i].reactId === reactId) {
      _circleItems[i] = assign(_circleItems[i], payload);
    }
  }
};

var deleteId = function(reactId){
  for (var i = 0; i < _circleItems.length; i++) {
    if (_circleItems[i].reactId === reactId) {
      _circleItems.splice(i, 1);
    }
  }
};

var deleteGuid = function(guid, targetGuid){
  for (var i = 0; i < _circleItems.length; i++) {
    if (_circleItems[i].guid === guid) {
      var keyArray = Object.keys(_circleItems[i]);
      for (var j = 0; j < keyArray.length; j++) {
        var key = keyArray[j];
        if (_circleItems[i][key] === targetGuid) {
          delete _circleItems[i][key];
        }
      }
    }
  }
};

var updateGuidFromServer = function(reactId, guid) {
  for (var i = 0; i < _circleItems.length; i++) {
    if (_circleItems[i].reactId === reactId) {
      _circleItems[i].guid = guid;
    }
  }
};

var updatePayloadFromServer = function(guid, payload){
  for (var i = 0; i < _circleItems.length; i++) {
    if (_circleItems[i].guid === guid) {
      _circleItems[i] = assign(_circleItems[i], payload);
    }
  }
};

//Circle of trust store
var CircleStore = assign({}, EventEmitter.prototype, {
  getAll: function() {
    // console.log(_circleItems);
    return _circleItems;
  },

  emitChange: function(){
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback){
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback){
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
