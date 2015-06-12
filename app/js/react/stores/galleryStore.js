'use strict';

var AppDispatcher = require('../dispatcher/appDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var GalleryObjectConstants = require('../constants/galleryObjectConstants.js');
var assign = require('object-assign');

var CHANGE_EVENT = 'gallery';

var _galleryItems = [];

var createGallery = function(reactId, payload){
  payload.reactId = reactId;
  _galleryItems.push(payload);
};

var updateGallery = function(reactId, payload){
  for (var i = 0; i < _galleryItems.length; i++) {
    if (_galleryItems[i].reactId === reactId) {
      _galleryItems[i] = assign(_galleryItems[i], payload);
    }
  }
};

var deleteId = function(reactId){
  for (var i = 0; i < _galleryItems.length; i++) {
    if (_galleryItems[i].reactId === reactId) {
      _galleryItems.splice(i, 1);
    }
  }
};

//Circle of trust store
var GalleryStore = assign({}, EventEmitter.prototype, {
  getAll: function() {
    // console.log(_galleryItems);
    return _galleryItems;
  },

  emitChange: function(){
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback){
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback){
    this.removeListener(CHANGE_EVENT, callback);
  }
});

AppDispatcher.register(function(action){

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
