'use strict';

const messageConstants = require('../constants/messageConstants.js');
const uuid = require('node-uuid');
const AppDispatcher = require('../dispatcher/appDispatcher.js');

let messageAction = {};

messageAction.add = (payload) => {
  AppDispatcher.dispatch({
    actionType: messageConstants.MESSAGE_CREATE,
    payload: payload,
    reactId: uuid.v1()
  });
};

module.exports = messageAction;
