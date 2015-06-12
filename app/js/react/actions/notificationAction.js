'use strict';

var notificationConstants = require('../constants/notificationConstants.js');
var uuid = require('node-uuid');
var AppDispatcher = require('../dispatcher/appDispatcher.js');

var notificationAction = {};

notificationAction.add = function(payload){
  // console.log('add notification action called');
  AppDispatcher.dispatch({
    actionType: notificationConstants.NOTIFICATION_CREATE,
    payload: payload,
    reactId: uuid.v1()
  });
};

module.exports = notificationAction;
