'use strict';
const DOES_NOT_EXIST = 'does not exist';
const NOT_PROVIDED = 'A required value was not provided:';
const GET = 'get';
const $ = require('jquery');

let _que = [];
let processing = false;
//all ajax gets routed here.
let universalPost = (payload, url, callback) => {
  // console.log('called');
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

let doTask = () => {
  // console.log('que length', _que.length, _que);
  if (_que.length > 0) {
    // if there is no current pending create or update ajax process execute the ajax
    if (processing === false) {
      processing = true;
      // takes the payload object out of the que, first in, first out with array.shift
      let task = _que.shift();
      // console.log('sending ajax', task);
      post(task.payload, task.url, task.callback, () => {
        // when the callback completes, set processing to false and execute the next ajax in the same order which it came
        // recursively emptying the que until the length of the que is 0;
        processing = false;
        doTask();
      });
    }
  }
};

let post = (payload, url, callback, done) => {
  // console.log(_que);
  done = done || function() {};
  let token = sessionStorage.getItem('tokenKey');
  let profileGuid = sessionStorage.getItem('activeProfile');
  let uri = window.API_ROOT + url;
  let headers = {};
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
    success (data) {
      // console.log('url\n', uri, '\npayload\n', payload, '\nresponse\n', data);
      sessionStorage.setItem('tokenKey', data.access_token);

      //retry on wrong profile guid or no profileguid
      if (data.Error) {
        let errorString = data.Error;
        // console.log(errorString);
        // if error substring contains 'does not exist', set the profile guid.
        if (errorString.indexOf(DOES_NOT_EXIST) !== -1) {
          // console.log(DOES_NOT_EXIST);
          setActiveProfile(payload, url, callback, done);
        } else if (errorString.indexOf(NOT_PROVIDED) !== -1) {
          // console.log(NOT_PROVIDED);
          setActiveProfile(payload, url, callback, done);
        }
      }
      //else
      callback(data);
      done();
    },
    error (data) {
      // console.log(error);
      if (data.access_token) {
        sessionStorage.setItem('tokenKey', data.access_token);
      }
      // if the error status code is 403 forbidden, kick the user to default
      if (data.status === '403' || data.status === 403) {
        sessionStorage.setItem('tokenKey', 'invalid');
        sessionStorage.setItem('activeProfile', 'invalid');
        sessionStorage.clear();
        window.location.replace(window.GLOBAL_WEB_ROOT);
      }
    }

  });
};

let setActiveProfile = (retryPayload, url, callback, done) => {
  // let newuri = API_ROOT + 'api/profiles/getuserdefaultprofile';
  console.log('set active profile called again');
  let setActiveProfileUrl = 'api/profiles/getuserdefaultprofile';
  let payload = {
    'includePhoto': 'true'
  };
  let token = sessionStorage.getItem('tokenKey');
  let headers = {};
  if (token) {
    headers.Authorization = 'Bearer ' + token;
  }
  //sets the profile guid
  post(payload, setActiveProfileUrl, () => {
    // repeat the failed ajax.
    post(retryPayload, url, callback, done);
  });
};


module.exports = universalPost;
