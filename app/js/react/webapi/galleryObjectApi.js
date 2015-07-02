'use strict';

const universalPost = require('./universalPost.js');
let galleryObjectApi = {};

//moveGalleryObjectToPersonalManifest
galleryObjectApi.moveGalleryObjectToPersonalManifest = (objectGuid) => {
  let url = 'api/galleryobjects/movegalleryobjecttopersonalmanifest';
  let payload = {};
  // required
  payload.objectGuid = objectGuid;
  universalPost(payload, url, (data) => {
    console.log(data);
  });
};

galleryObjectApi.getGalleryObjectThumbnail = (objectGuid, callback) => {
  let url = 'api/galleryobjects/getgalleryobject';
  let payload = {};
  payload.objectGuid = objectGuid;
  payload.includeThumbnail = 'true';
  payload.includeImage = 'false';
  universalPost(payload, url, (data) => {
    callback(data);
  });
};

module.exports = galleryObjectApi;
