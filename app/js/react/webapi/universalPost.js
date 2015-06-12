'use strict';
var base = window.API_ROOT;
var DOES_NOT_EXIST = 'does not exist';
var NOT_PROVIDED = 'The required value';
var GET = 'get';
var $ = require('jquery');

var _que = [];
var processing = false;

//all ajax gets routed here.
var universalPost = function(payload, url, callback) {
  // if this is not a get route, put the payload in the que because create and update must be a sync operation.
  if (url.indexOf(GET) === -1) {
    // console.log('create route detected, adding to que');
    _que.push({
      payload: payload,
      url: url,
      callback: callback
    });
    // then start executing it.
    doTask();
    // if it is a get route, just make the ajax call and get the information back.
  } else {
    post(payload, url, callback);
  }
};

var doTask = function() {
  // console.log('que length', _que.length, _que);
  if (_que.length > 0) {
    // if there is no current pending create or update ajax process execute the ajax
    if (processing === false) {
      processing = true;
      // takes the payload object out of the que, first in, first out with array.shift
      var task = _que.shift();
      // console.log('sending ajax', task);
      post(task.payload, task.url, task.callback, function() {
        // when the callback completes, set processing to false and execute the next ajax in the same order which it came
        // recursively emptying the que until the length of the que is 0;
        processing = false;
        doTask();
      });
    }
  }
};

var post = function(payload, url, callback, done) {
  // console.log(_que);
  done = done || function() {};
  var token = sessionStorage.getItem('tokenKey');
  var profileGuid = sessionStorage.getItem('activeProfile');
  var uri = base + url;
  var headers = {};
  if (token) {
    headers.Authorization = 'Bearer ' + token;
  }
  payload.profileGuid = profileGuid;
  $.ajax({
    type: 'POST',
    url: uri,
    headers: headers,
    data: JSON.stringify(payload),
    dataType: 'json',
    contentType: 'application/json; charset=utf8',
    success: function(data) {
      // var parseData = $.parseJSON(data);
      // console.log(parseData);
      console.log('url\n', uri, '\npayload\n', payload, '\nresponse\n', data);

      //retry on wrong profile guid due to loading too fast.
      if (data.Error) {
        var errorString = data.Error;
        sessionStorage.setItem('tokenKey', data.access_token);
        // if error substring contains 'does not exist', set the profile guid.
        if (errorString.indexOf(DOES_NOT_EXIST) !== -1 || errorString.indexOf(NOT_PROVIDED) !== -1) {
          setActiveProfile(payload, url, callback, done);
        }

      }
      //else
      sessionStorage.setItem('tokenKey', data.access_token);
      callback(data);
      done();
    },
    error: function(data, success, error) {
      console.log(error);
      if (data.access_token !== undefined) {
        sessionStorage.setItem('tokenKey', data.access_token);
      }
      // if the error status code is 403 forbidden, kick the user to default
      if (data.status === '403' || data.status === 403) {
        sessionStorage.setItem('tokenKey', 'invalid');
        sessionStorage.setItem('activeProfile', 'invalid');
        sessionStorage.clear();
        window.location.replace(GLOBAL_WEB_ROOT);
      }
    }

  });
};

var setActiveProfile = function(retryPayload, url, callback, done) {
  // var newuri = API_ROOT + 'api/profiles/getuserdefaultprofile';
  console.log('set active profile called again');
  var setActiveProfileUrl = 'api/profiles/getuserdefaultprofile';
  var payload = {
    'includePhoto': 'true'
  };
  var token = sessionStorage.getItem('tokenKey');
  var headers = {};
  if (token) {
    headers.Authorization = 'Bearer ' + token;
  }
  //sets the profile guid
  post(payload, setActiveProfileUrl, function() {
    // repeat the failed ajax.
    post(retryPayload, url, callback, done);
  });
};


module.exports = universalPost;
