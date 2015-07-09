'use strict';

const universalPost = require('./universalPost.js');
const io = require('socket.io-client');
const notificationAction = require('../actions/notificationAction.js');
let notificationApi = {};

notificationApi.subscribe = (callback) => {
  let url = 'api/notifications/getsubscriptionchannel';
  let payload = {};
  payload.subscriptionType = 'internal';
  universalPost(payload, url, function(data) {
    callback(data);
  });
};

notificationApi.completeSubscription = (subscriptionChannel) => {
  let host = window.SUB_ROOT + ':943';
  // console.log(window.SUB_ROOT);
  // console.log(host);
  // let host = 'http://10.0.10.124:3000';
  let socket = io(host);

  socket.on('requestSubscriptionChannel', () => {
    let token = sessionStorage.getItem('tokenKey');
    socket.emit('subscriptionChannel', {
      subscriptionChannel: subscriptionChannel,
      subscriptionType: 'internal',
      token: token
    });
  });

  socket.on('verificationFailure', () => {
    // console.log('verificationFailure', data);
    socket.close();
  });

  socket.on('notificationMessage', (data) => {
    // console.log('time', Date.now(), 'data', data);
    notificationAction.add(data);
  });

  // console.log('Should now be subscribed to: ' + subscriptionChannel);
};

module.exports = notificationApi;
