'use strict';

const AppDispatcher = require('../dispatcher/appDispatcher.js');
const EventEmitter = require('events').EventEmitter;
const messageConstants = require('../constants/messageConstants.js');
const assign = require('object-assign');

const CHANGE_EVENT = 'message';

let _messageItems = [];

let createMessage = (reactId, payload) => {
  payload.reactId = reactId;
  _messageItems.unshift(payload);
};

let updateMessage = (reactId, payload) => {
  for (let i = 0; i < _messageItems.length; i++) {
    if (_messageItems[i].reactId === reactId) {
      _messageItems[i] = assign(_messageItems[i], payload);
    }
  }
};

let deleteMessageById = (reactId) => {
  for (let i = 0; i < _messageItems.length; i++) {
    if (_messageItems[i].reactId === reactId) {
      _messageItems.splice(i, 1);
    }
  }
};

//Circle of trust store
let messageStore = assign({}, EventEmitter.prototype, {
  getAll () {
    // console.log(_messageItems);
    return _messageItems;
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
  // console.log(action);
  switch(action.actionType){
    case messageConstants.MESSAGE_CREATE:
      createMessage(action.reactId, action.payload);
      messageStore.emitChange();
      break;

    case messageConstants.MESSAGE_DESTROY:
      deleteMessageById(action.reactId);
      messageStore.emitChange();
      break;

    case messageConstants.MESSAGE_UPDATE:
      updateMessage(action.reactId, action.payload);
      messageStore.emitChange();
      break;

    default:
      //no operation
  }

});

module.exports = messageStore;
