'use strict';

const notificationConstants = require('../constants/notificationConstants.js');
// const messageAction = require('./messageAction.js');
const uuid = require('node-uuid');
const AppDispatcher = require('../dispatcher/appDispatcher.js');

let notificationAction = {};

//TODO write out a splitter here to route messages that are belonging to chat to another section
notificationAction.add = (payload) => {
  // console.log('add notification action called');
  AppDispatcher.dispatch({
    actionType: notificationConstants.NOTIFICATION_CREATE,
    payload: payload,
    reactId: uuid.v1()
  });

  // messageAction.add(payload);
};

notificationAction.delete = (reactId) => {
  AppDispatcher.dispatch({
    actionType: notificationConstants.NOTIFICATION_DESTROY,
    reactId: reactId
  });
};

module.exports = notificationAction;
