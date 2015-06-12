'use strict';

var AppDispatcher = require('../dispatcher/appDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var notificationConstants = require('../constants/notificationConstants.js');
var assign = require('object-assign');

var CHANGE_EVENT = 'notification';

var _notificationItems = [];

var createnotification = function(reactId, payload){
  payload.reactId = reactId;
  _notificationItems.unshift(payload);
};

var updatenotification = function(reactId, payload){
  for (var i = 0; i < _notificationItems.length; i++) {
    if (_notificationItems[i].reactId === reactId) {
      _notificationItems[i] = assign(_notificationItems[i], payload);
    }
  }
};

var deleteId = function(reactId){
  for (var i = 0; i < _notificationItems.length; i++) {
    if (_notificationItems[i].reactId === reactId) {
      _notificationItems.splice(i, 1);
    }
  }
};

//Circle of trust store
var notificationStore = assign({}, EventEmitter.prototype, {
  getAll: function() {
    // console.log(_notificationItems);
    return _notificationItems;
  },

  emitChange: function(){
    this.emit(CHANGE_EVENT);
    // console.log('emit change called');
  },

  addChangeListener: function(callback){
    this.on(CHANGE_EVENT, callback);
    // console.log('change listner registered and called');
  },

  removeChangeListener: function(callback){
    this.removeListener(CHANGE_EVENT, callback);
  }
});

AppDispatcher.register(function(action){

  switch(action.actionType){

    case notificationConstants.NOTIFICATION_CREATE:
      createnotification(action.reactId, action.payload);
      notificationStore.emitChange();
      // console.log('notification store emit change called');
      break;

    case notificationConstants.NOTIFICATION_DESTROY:
      deleteId(action.reactId);
      notificationStore.emitChange();
      break;

    case notificationConstants.NOTIFICATION_UPDATE:
      updatenotification(action.reactId, action.payload);
      notificationStore.emitChange();
      break;

    default:
      //no operation
  }

});

module.exports = notificationStore;
