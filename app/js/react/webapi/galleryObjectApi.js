'use strict';

const universalPost = require('./universalPost.js');
let galleryObjectApi = {};

//moveGalleryObjectToPersonalManifest
galleryObjectApi.moveGalleryObjectToPersonalManifest = (objectGuid, callback) => {
  let url = 'api/galleryobjects/movegalleryobjecttopersonalmanifest';
  let payload = {};
  // required
  payload.objectGuid = objectGuid;
  universalPost(payload, url, (data) => {
    callback(data);
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

// categoryList takes [string,string]
galleryObjectApi.addCategoryToGalleryObject = (objectGuid, categoryList, callback) => {
  let url = 'api/galleryobjects/addcategorytogalleryobject';
  let payload = {};
  payload.objectGuid = objectGuid;
  payload.categoryList = categoryList.toString();
  if (payload.categoryList) {
    universalPost(payload, url, (data) => {
      callback(data);
    });
  }
};

module.exports = galleryObjectApi;
