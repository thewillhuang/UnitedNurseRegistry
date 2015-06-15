'use strict';

const AppDispatcher = require('../dispatcher/appDispatcher.js');
const EventEmitter = require('events').EventEmitter;
const notificationConstants = require('../constants/notificationConstants.js');
const assign = require('object-assign');

const CHANGE_EVENT = 'notification';

let _notificationItems = [];

let createnotification = (reactId, payload) => {
  payload.reactId = reactId;
  _notificationItems.unshift(payload);
};

let updatenotification = (reactId, payload) => {
  for (let i = 0; i < _notificationItems.length; i++) {
    if (_notificationItems[i].reactId === reactId) {
      _notificationItems[i] = assign(_notificationItems[i], payload);
    }
  }
};

let deleteId = (reactId) => {
  for (let i = 0; i < _notificationItems.length; i++) {
    if (_notificationItems[i].reactId === reactId) {
      _notificationItems.splice(i, 1);
    }
  }
};

//Circle of trust store
let notificationStore = assign({}, EventEmitter.prototype, {
  getAll () {
    // console.log(_notificationItems);
    return _notificationItems;
  },

  emitChange (){
    this.emit(CHANGE_EVENT);
    // console.log('emit change called');
  },

  addChangeListener (callback){
    this.on(CHANGE_EVENT, callback);
    // console.log('change listner registered and called');
  },

  removeChangeListener (callback){
    this.removeListener(CHANGE_EVENT, callback);
  }
});

AppDispatcher.register((action) => {

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
