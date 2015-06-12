"use strict";

// var assign = require("object-assign");

// api
var api = {
  getObjectInclusiveRelationshipList: function(objectGuid, objectType, callback){
    var profileGuid = sessionStorage.getItem("activeProfile");
    var url = "api/inclusiverelationships/getobjectinclusiverelationshiplist";
    var newuri = API_ROOT + url;
    var payload = {};
    payload.objectGuid = objectGuid;
    payload.objectType = objectType;
    payload.profileGuid = profileGuid;
    ajaxPost(newuri, payload, function(data) {
      callback(data);
    });
  },

  getInclusiveRelationship: function(inclusiveRelationshipGuid, callback){
    var profileGuid = sessionStorage.getItem("activeProfile");
    var url = "api/inclusiverelationships/getinclusiverelationship";
    var newuri = API_ROOT + url;
    var payload = {};
    payload.inclusiveRelationshipGuid = inclusiveRelationshipGuid;
    payload.forDisplay = "true";
    payload.profileGuid = profileGuid;
    ajaxPost(newuri, payload, function(data) {
      callback(data);
    });
  }

};

// store
var userPermissionStore = {
  _userPermissions: [],

  userAdd : function(id, payload) {
    payload.id = id;
    this._userPermissions.push(payload);
  },

  userDelete : function(id) {
    for (var i = 0; i < this._userPermissions.length; i++) {
      if (this._userPermissions[i].id === id) {
        this._userPermissions.splice(i, 1);
      }
    }
  },

  // userUpdate : function(id, payload){
  //   for (var i = 0; i < this._userPermissions.length; i++) {
  //     if (this._userPermissions[i].id === id) {
  //       assign(this._userPermissions[i], payload);
  //     }
  //   }
  // },

  clearUsers : function(){
    this._userPermissions = [];
  },

  getAll: function(){
    return this._userPermissions;
  },
};

// actions
var ObjectPermissionActions = {

  generateGuid: function(min, max) {
    return Date.now().toString() + (Math.floor(Math.random() * (max - min)) + min);
  },

  createOne: function(inclusiveRelationshipGuid){
    api.getInclusiveRelationship(inclusiveRelationshipGuid, function(data){
      console.log(data);
      userPermissionStore.userAdd(ObjectPermissionActions.generateGuid(1,9999999999), data);
    });
  },

  grabInfo: function(objectGuid, objectType){
    // flush the store
    userPermissionStore.clearUsers();

    api.getObjectInclusiveRelationshipList(objectGuid, objectType, function(data){
      console.log(data);
      var guidArray = data.inclusiveListGuids.split(",");
      for (var i = 0; i < guidArray.length; i++) {
        ObjectPermissionActions.createOne(guidArray[i]);
      }
    });
  },

  grabAllFromStore: function(){
    return userPermissionStore.getAll();
  },

  //TODO
  update: function(){}
};

//view
// item
$(document).on("click", ".add-security", function(){
  console.log("clicked");
  var objectType = "GalleryObject";
  $("#permissionModal").modal("show");
  var objectGuid = $(this).closest(".user-item").attr("id");
  console.log(objectGuid, objectType);
  ObjectPermissionActions.grabInfo(objectGuid, objectType);
});
