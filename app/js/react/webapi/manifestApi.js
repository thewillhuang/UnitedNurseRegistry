'use strict';

var universalPost = require('./universalPost.js');
var manifestApi = {};
var $ = require('jquery');

//submitRequestForMedicalRecords
manifestApi.submitRequestForMedicalRecords = function(providerEmail, expires, providerType, business, phone, urgent, providerFirstName, providerLastName, callback) {
  var url = 'api/manifests/submitrequestformedicalrecords';
  var payload = {};
  // required
  payload.providerEmail = providerEmail;
  // required
  payload.expires = expires;
  //optional
  payload.providerType = providerType;
  //optional
  payload.business = business;
  //optional
  payload.phone = phone;
  // optional string 'true' || 'false'
  payload.urgent = urgent;
  payload.providerLastName = providerLastName;
  payload.providerFirstName = providerFirstName;
  universalPost(payload, url, function(data){
    callback(data);
  });
};

//createMedicalRecordsRequestUrl

manifestApi.createMedicalRecordsRequestUrl = function(expires, callback){
  var url = 'api/manifests/createmedicalrecordsrequesturl';
  var payload = {};
  payload.expires = expires;
  universalPost(payload, url, function(data){
    // console.log(data);
    callback(data);
  });
};

//getRecordRequestDetails
manifestApi.getRecordRequestDetails = function(guid, callback) {
  var payload = {};
  payload.key = guid;
  var headers = {};
  headers.Payload = JSON.stringify({key: guid});
  var newuri = window.API_ROOT + 'api/manifests/getrecordrequestdetails';
  $.ajax({
      type: 'POST',
      url: newuri,
      headers: headers,
      data: JSON.stringify(payload),
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      success: function (data) {
        callback(data);
      },
      error: function (data, success, error) {
        console.log(data, success, error);
      }
  });
};

module.exports = manifestApi;
