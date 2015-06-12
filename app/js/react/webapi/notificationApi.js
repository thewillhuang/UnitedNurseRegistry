'use strict';

var universalPost = require('./universalPost.js');
var io = require('socket.io-client');
var notificationApi = {};
var notificationAction = require('../actions/notificationAction.js');

notificationApi.subscribe = function(callback) {
  var url = 'api/notifications/getsubscriptionchannel';
  var payload = {};
  payload.subscriptionType = 'internal';
  universalPost(payload, url, function(data) {
    callback(data);
  });
};

notificationApi.completeSubscription = function(subscriptionChannel) {
  var host = 'http://beta.lifespeed.io:943';
  // var host = 'http://10.0.10.124:3000';
  var socket = io(host);

  socket.on('requestSubscriptionChannel', function() {
    var token = sessionStorage.getItem('tokenKey');
    socket.emit('subscriptionChannel', {
      subscriptionChannel: subscriptionChannel,
      subscriptionType: 'internal',
      token: token
    });
  });

  socket.on('verificationFailure', function(data){
    console.log('verificationFailure', data);
    socket.close();
  });

  socket.on('notificationMessage', function(data){
    // console.log(data);
    notificationAction.add(data);
  });

  console.log('Should now be subscribed to: ' + subscriptionChannel);
};

module.exports = notificationApi;
