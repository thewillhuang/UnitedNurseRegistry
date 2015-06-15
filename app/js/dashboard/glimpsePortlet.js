var currentGlimpse = "";
var urgency = "";
var categories = "";
var category = "";
var noteCategory = "";
//
// Object to fill Glimpse Portlet
//
var Glimpse = {

    glimpseGuids: [],
    glimpseGalleryObjects: [],

    fillGlimpsePortlet: function() {
      $("#glimpsesSent").empty();
      $("#glimpsesReceived").empty();
      $("#glimpsesSent").append('<h4 style="font-family: open-sans, sans-serif; font-weight: 500; margin-left: 10px; color: #00a1d3;"> Glimpses Sent</h4>');
      $("#glimpsesReceived").append('<h4 style="font-family: open-sans, sans-serif; font-weight: 500; margin-left: 10px; color: #00a1d3"> Glimpses Received</h4>');
      // That the user sent
      this.getGlimpses('true');
      // That the user is receiving
      this.getGlimpses('false');
    },

    getGlimpses: function(sent) {
      var newuri = API_ROOT + 'api/glimpses/getglimpses';
      var profileGuid = sessionStorage.getItem("activeProfile");
      var payload = {
        'profileGuid': profileGuid,
        'sent': sent
      };
      ajaxPost(newuri, payload, function(data, done, message) {
        if (done && data.glimpseGuids) {
          Glimpse.glimpseGuids = $.parseJSON(data.glimpseList);
          for (var i in Glimpse.glimpseGuids) {
            var currentGlimpseGuid = Glimpse.glimpseGuids[i];
            Glimpse.getGlimpse(currentGlimpseGuid, sent);
          } //end for loop
        } else {
          return false;
        }
      });
    },

    getGlimpse: function(glimpseGuid, sent) {
      var newuri = API_ROOT + 'api/glimpses/getglimpse';
      var profileGuid = sessionStorage.getItem("activeProfile");
      var payload = {
        'profileGuid': profileGuid,
        'glimpseGuid': glimpseGuid
      };
      ajaxPost(newuri, payload, function(data, done, message) {
        if (done) {
          var galleryObjectGuids = $.parseJSON(data.galleryObjectList);
          $.each(galleryObjectGuids, function(index, value) {
            getGlimpseGalleryObject(value, glimpseGuid);
          });
          var expiresPretty = moment(data.currentExpirationDate).format('dddd, MMMM Do, YYYY');
          var createdPretty = moment(data.createdDate).format('dddd, MMMM Do, YYYY');
          if (sent == "true") {
            var glimpseSentHtml = '<div class="user-glimpse" id="' + glimpseGuid + '"><h4 class="glimpse-title pull-left">' + data.label + '</h4><a class="edit-glimpse pull-right btn btn-sm btn-primary" style="margin-left: 5px;">View</a><a class="view-glimpse-notes pull-right btn btn-sm btn-primary">Notes</a><p style="clear: both;"><i class="fa fa-user"></i><b>Sent to:</b> ' + data.inclusiveList + '</p><p><i class="fa fa-warning"></i><b>Expires:</b> ' + expiresPretty + '</p><p><i class="fa fa-info"></i><b>Description:</b> ' + data.description + '</p><div class="glimpse-images"></div></div>';
            $("#glimpsesSent").append(glimpseSentHtml);
          } else {
            // if (data.)
            var glimpseReceivedHtml = '<div class="user-glimpse" id="' + glimpseGuid + '"><h4 class="glimpse-title pull-left">' + data.label + '</h4><a class="edit-glimpse pull-right btn btn-sm btn-primary" style="margin-left: 5px;">View</a><a class="view-glimpse-notes pull-right btn btn-sm btn-primary">Notes</a><p style="clear: both;"><i class="fa fa-user"></i><b>Sent to:</b> ' + data.inclusiveList + '</p><p><i class="fa fa-warning"></i><b>Expires:</b> ' + expiresPretty + '</p><p><i class="fa fa-info"></i><b>Description:</b> ' + data.description + '</p><div class="glimpse-images"></div></div>';
            $("#glimpsesReceived").append(glimpseReceivedHtml);
          }
        }
      });
    }

  }

  //
  // Glimpse dashboard MODAL functionality
  //

  // Get each glimpse data object
function getGlimpseGalleryObject(objectGuid, glimpseGuid) {
  var newuri = API_ROOT + 'api/galleryobjects/getgalleryobject';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
    'profileGuid': profileGuid,
    'objectGuid': objectGuid,
    'includeThumbnail': 'true',
    'includeImage': 'false'
  };
  ajaxPost(newuri, payload, function(data, done, message) {
    if (done) {
      var elem = $('<div class="user-item-dashboard"><img src="data:image/jpg;base64,' + data.thumbnail + '" style="width: 100px; height: 100px; cursor: pointer;"></div>');
      $(elem).on('click', function() {
        if (data.type == "DICOM_STUDY") {
          dicomViewerLoadStudy(objectGuid);
        } else {
          imageViewerLoadStudy(objectGuid, data.type);
        }
      });
      var glimpseDiv = $("#" + glimpseGuid).find('div.glimpse-images');
      $(glimpseDiv).append(elem);
      //Init cool scrollbar
      $(function() {
        $('.glimpse-images').slimScroll({
          height: '110px'
        });
      });
    }
  });
}

// Add another field dynamically to page
$("#addGlimpseRecipientField").click(function(){
  var html = '<div class="form-group"><input type="text" class="form-control add-user-to-glimpse" placeholder="User email to add"></input></div>';
  $("#addGlimpseRecipients").append(html);
});
// Click to edit glimpse and launch modal
$(document).on('click', '.edit-glimpse', function() {
  var glimpseGuid = $(this).closest("div.user-glimpse").attr('id');
  fillGlimpseModal(glimpseGuid, function (done){
    if (done){
      $("#glimpseEditModal").modal('show');
    }
  });
});
// Click to view and add glimpse notes
$(document).on('click', '.view-glimpse-notes', function(){
  currentGlimpse = $(this).parent(".user-glimpse").attr("id");
  getObjectNotes(currentGlimpse, 'glimpse');
  $("#glimpseNoteModal").modal('show');
});
// Note dropdown event
$(document).on('click', '#noteDropdownList li a', function(event) {
  event.preventDefault();
  noteCategory = $(this).text();
  getCategory(noteCategory);
});
// User submitting a note to add to glimpse
$("#addNoteBtn").click(function() {
  var objectType = 'glimpse';
  createNote(currentGlimpse, objectType, noteCategory);
});
// Click to finalize editing a glimpse
$(document).on('click', '#editGlimpseBtn', function(){
  getAndEditGlimpse();
  //set timeout and refresh glimpse modal - Glimpse.fillGlimpsePortlet();
});
// Click to finalize deleting a glimpse
$(document).on('click', '#deleteGlimpseBtn', function(){
  deleteGlimpse(currentGlimpse);
});


function emptyGlimpseFields(){
  $("#glimpseModalImages").empty();
  $("#glimpseTitle").empty();
  $("#glimpseDescription").empty();
  $("#glimpseCategories").empty();
  $("#glimpseRecipients").empty();
  $("#addGlimpseRecipients").empty();
  $("#glimpseCurrentExpiration").empty();
}

function fillGlimpseModal(glimpseGuid, callback){
  emptyGlimpseFields();
  var glimpseImages = $("#" + glimpseGuid).find("div.glimpse-images").html();
  $("#glimpseModalImages").append(glimpseImages);
  getEditGlimpse(glimpseGuid, function(done){
    if (done){
      callback(true);
    }
  });
}

function getEditGlimpse(glimpseGuid, callback) {
  var newuri = API_ROOT + 'api/glimpses/getglimpse';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
    'profileGuid': profileGuid,
    'glimpseGuid': glimpseGuid
  };
  ajaxPost(newuri, payload, function(data, done, message) {
    if (done) {
      urgency = data.severity;
      var catHtml = "";
      categories = "";
      category = data.categoryList + ",";
      categories = $.parseJSON(data.categoryList);
      for (var i in categories){
        catHtml += '<span class="label label-danger">' + categories[i] + '</span>';
      }
      $("#glimpseTitle").append(data.label);
      $("#glimpseDescription").append("<h4>Description: </h4>" + '<textarea class="form-control" id="glimpseEditDesc" rows="4">' + data.description + '</textarea>');
      $("#glimpseCategories").append("<h4 style='margin-bottom: 10px;'>Categories: </h4>" + catHtml);
      //Init cool scrollbar
      $(function() {
        $('#glimpseCategories').slimScroll({
          height: '50px;'
        });
      });
      var prettyDate = moment(data.originalExpirationDate).format('dddd, MMMM Do, YYYY');
      $("#glimpseCurrentExpiration").append('<div class="col-md-6 current-exp" id="' + data.originalExpirationDate + '"><h4>Expires: </h4><p>' + prettyDate + '</p></div><div class="col-md-6 pull-right"><p>New Expiration (Days from now)</p><input type="text" id="glimpseExp"></input></div>');
      var sharedWith = $.parseJSON(data.inclusiveList);
      $("#glimpseRecipients").append('<div class="row"><div class="col-md-12"><h4>Shared With: </h4></div></div>');
      for (var i in sharedWith){
        var html = '<div class="row"><div class="col-md-6"><p class="pull-left">' + sharedWith[i] + '</p></div><div class="col-md-6"><div class="checkbox"><label class="pull-right"><input type="checkbox" class="remove-user-from-glimpse" value="' + sharedWith[i] + '"> Remove this user from glimpse</label></div></div>';
        $("#glimpseRecipients").append(html);
      }
      currentGlimpse = glimpseGuid;
      callback(true);
    } else {
      return false;
    }
  });
}

function getAndEditGlimpse(){
  var description = $("#glimpseEditDesc").val();
  var days = $("#glimpseExp").val();
  var currentExp = $(".current-exp").attr("id");
  var expiration;
  var title = $("#glimpseTitle").html();
  if (days){
    Date.prototype.addDays = function(days) {
        this.setDate(this.getDate() + parseInt(days));
        return this;
    };
    var date = new Date();
    date.addDays(days);
    expiration = date;
  } else {
    expiration = currentExp;
  }
  var usersToAdd = "";
  var usersToRemove = "";
  var categoriesToAdd = "";
  $('.add-user-to-glimpse').each(function() {
    usersToAdd += ($(this).val() + ",");
  });
  $('.remove-user-from-glimpse').each(function(){
    if ($(this).is(":checked")){
      usersToRemove += ($(this).val() + ",");
    }
  });
  categoriesToAdd = $("#addCategoriesToGlimpse").val();
  console.log(categoriesToAdd);
  categories += "," + categoriesToAdd + ",";
  console.log(categories);
  updateGlimpse(currentGlimpse, title, description, expiration, categories);
  if (usersToAdd){
    addUsersToGlimpse(currentGlimpse, usersToAdd);
  }
  if (usersToRemove){
    removeUsersFromGlimpse(currentGlimpse, usersToRemove);
  }
}

//updateGlimpse
function updateGlimpse(glimpseGuid, title, description, expirationDate, categories) {
  var newuri = API_ROOT + 'api/glimpses/updateglimpse';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
      'profileGuid': profileGuid,
      'label': title,
      'severity': urgency,
      'categoryList': categories,
      'glimpseGuid': glimpseGuid,
      'currentExpirationDate': expirationDate,
      'description': description,
      'canAddObjectsToGlimpse': 'true',
      'canViewGlimpseNotes': 'true',
      'canAddNotesToGlimpse': 'true',
      'canShareGlimpse': 'true'
  };
  console.log(payload);
  ajaxPost(newuri, payload, function(data, done, message){
     if (done){
       sweetAlert("Updated glimpse!");
       Glimpse.fillGlimpsePortlet();
     } else {
       return false;
     }
  });
}

function addUsersToGlimpse(glimpseGuid, recipientList) {
  var newuri = API_ROOT + 'api/glimpses/adduserstoglimpse';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
      'profileGuid': profileGuid,
      'glimpseGuid': glimpseGuid,
      'recipientList': recipientList,
      'canAddObjectsToGlimpse': 'true',
      'canViewGlimpseNotes': 'true',
      'canAddNotesToGlimpse': 'true',
      'canShareGlimpse': 'true'
  };
  ajaxPost(newuri, payload, function(data, done, message){
    if (done){
      sweetAlert("Added users to glimpse!");
    } else {
      return false;
    }
  });
}

function removeUsersFromGlimpse(glimpseGuid, recipientList) {
  var newuri = API_ROOT + 'api/glimpses/removeusersfromglimpse';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
      'profileGuid': profileGuid,
      'glimpseGuid': glimpseGuid,
      'recipientList': recipientList
  };
  ajaxPost(newuri, payload, function(data, done, message){
    if (done){
      sweetAlert("Removed users from glimpse!");
    } else {
      return false;
    }
  });
}

function deleteGlimpse(glimpseGuid){
  var newuri = API_ROOT + 'api/glimpses/deleteglimpse';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
      'profileGuid': profileGuid,
      'glimpseGuid': glimpseGuid
  };
  ajaxPost(newuri, payload, function(data, done, message){
    if (done){
      $("#glimpseEditModal").modal("hide");
      sweetAlert("Glimpse deleted!");
    } else {
      return false;
    }
  });
}
