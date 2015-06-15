'use strict';

const AppDispatcher = require('../dispatcher/appDispatcher.js');
const EventEmitter = require('events').EventEmitter;
const GalleryObjectConstants = require('../constants/galleryObjectConstants.js');
const assign = require('object-assign');

const CHANGE_EVENT = 'gallery';

let _galleryItems = [];

let createGallery = (reactId, payload) => {
  payload.reactId = reactId;
  _galleryItems.push(payload);
};

let updateGallery = (reactId, payload) => {
  for (let i = 0; i < _galleryItems.length; i++) {
    if (_galleryItems[i].reactId === reactId) {
      _galleryItems[i] = assign(_galleryItems[i], payload);
    }
  }
};

let deleteId = (reactId) => {
  for (let i = 0; i < _galleryItems.length; i++) {
    if (_galleryItems[i].reactId === reactId) {
      _galleryItems.splice(i, 1);
    }
  }
};

//Circle of trust store
let GalleryStore = assign({}, EventEmitter.prototype, {
  getAll () {
    // console.log(_galleryItems);
    return _galleryItems;
  },

  emitChange (){
    this.emit(CHANGE_EVENT);
  },

  addChangeListener (callback){
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener (callback){
    this.removeListener(CHANGE_EVENT, callback);
  }
});

AppDispatcher.register((action) => {

  switch(action.actionType){

    case GalleryObjectConstants.GALLERY_CREATE:
      createGallery(action.reactId, action.payload);
      GalleryStore.emitChange();
      break;

    case GalleryObjectConstants.GALLERY_DESTROY:
      deleteId(action.reactId);
      GalleryStore.emitChange();
      break;

    case GalleryObjectConstants.GALLERY_UPDATE:
      updateGallery(action.reactId, action.payload);
      GalleryStore.emitChange();
      break;

    default:
      //no operation
  }

});

module.exports = GalleryStore;
