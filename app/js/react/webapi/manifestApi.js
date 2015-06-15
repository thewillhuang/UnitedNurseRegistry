'use strict';

const universalPost = require('./universalPost.js');
const manifestApi = {};
const $ = require('jquery');

//submitRequestForMedicalRecords
manifestApi.submitRequestForMedicalRecords = (providerEmail, expires, providerType, business, phone, urgent, providerFirstName, providerLastName, callback) => {
  let url = 'api/manifests/submitrequestformedicalrecords';
  let payload = {};
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
  universalPost(payload, url, (data) => {
    callback(data);
  });
};

//createMedicalRecordsRequestUrl

manifestApi.createMedicalRecordsRequestUrl = (expires, callback) => {
  let url = 'api/manifests/createmedicalrecordsrequesturl';
  let payload = {};
  payload.expires = expires;
  universalPost(payload, url, function(data){
    // console.log(data);
    callback(data);
  });
};

//getRecordRequestDetails
manifestApi.getRecordRequestDetails = (guid, callback) => {
  let payload = {};
  payload.key = guid;
  let headers = {};
  headers.Payload = JSON.stringify({key: guid});
  let newuri = window.API_ROOT + 'api/manifests/getrecordrequestdetails';
  $.ajax({
      type: 'POST',
      url: newuri,
      headers: headers,
      data: JSON.stringify(payload),
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      success  (data) {
        callback(data);
      },
      error  (data, success, error) {
        console.log(data, success, error);
      }
  });
};

module.exports = manifestApi;
