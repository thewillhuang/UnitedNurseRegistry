'use strict';

const notificationConstants = require('../constants/notificationConstants.js');
const uuid = require('node-uuid');
const AppDispatcher = require('../dispatcher/appDispatcher.js');

let notificationAction = {};

notificationAction.add = (payload) => {
  // console.log('add notification action called');
  AppDispatcher.dispatch({
    actionType: notificationConstants.NOTIFICATION_CREATE,
    payload: payload,
    reactId: uuid.v1()
  });
};

module.exports = notificationAction;
