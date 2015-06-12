'use strict';

var universalPost = require('./universalPost.js');
var galleryObjectApi = {};

//moveGalleryObjectToPersonalManifest
galleryObjectApi.moveGalleryObjectToPersonalManifest = function(objectGuid) {
  var url = 'api/galleryobjects/movegalleryobjecttopersonalmanifest';
  var payload = {};
  // required
  payload.objectGuid = objectGuid;
  universalPost(payload, url, function(data){
    console.log(data);
  });
};

galleryObjectApi.getGalleryObjectThumbnail = function(objectGuid, callback){
  var url = 'api/galleryobjects/getgalleryobject';
  var payload = {};
  payload.objectGuid = objectGuid;
  payload.includeThumbnail = 'true';
  payload.includeImage = 'false';
  universalPost(payload, url, function(data){
    callback(data);
  });
};

module.exports = galleryObjectApi;
