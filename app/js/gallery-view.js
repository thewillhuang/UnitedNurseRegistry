$(document).ready(function() {
  //To display user avatar
  getUserDefaultProfile();
  //Needed
  $('#noteModal').modal({
    show: false
  });
  // Init dropdown
  $("#filterDropdown").dropdown();
  // Start Masonry
  var $container = $('#userDocs').masonry({
    columnWidth: 10,
    itemSelector: '.user-item',
    gutter: 10,
    // isFitWidth: true
  });
  // Hide filtering until use
  $("#filterText").hide();
  $("#filterDate").hide();
  $("#filterDate2").hide();
  // Get all data and display to user
  getGalleryObjectList(function(done, data) {
    if (done) {
      layoutData(data);
    }
  });
  // To initiate tooltips for buttons where desired (add title)
  $('button').tooltip();

});

//Global variables
var itemZoomed = false;
var msnry;
var galleryObjects = [];
var category;
var html = '';
var boardObjects;
var addGalleryObjects = "";
var addObjectGuids = "";
var currentObjectLabels = "";
var elems = '';
var galleryCounter = 0;
var currentFilter = "";

function masonryLayout(callback) {
  // Append new blocks
  $elems = $(elems);
  $container.append($elems).imagesLoaded(function() {
    $container.masonry('appended', $elems);
  });
  callback(true);
}

//Get default profile
function getUserDefaultProfile() {
  var token = sessionStorage.getItem("tokenKey");
  var newuri = API_ROOT + 'api/profiles/getuserdefaultprofile';
  var payload = {
    'includePhoto': 'true'
  }
  ajaxPost(newuri, payload, function(data, done, message) {
    if (done && data.firstName) {
      sessionStorage.setItem("activeProfile", data.guid);
      $("#userFirstName").text(data.firstName);
      $("#userBodyAvatar").attr("src", data.avatarPath);
      if (data.profilePhoto) {
        $("#headerAvatar").attr("src", "data:image/jpeg;base64," + data.profilePhoto);
        $("#sidebarAvatar").attr("src", "data:image/jpeg;base64," + data.profilePhoto);
      }
    } else {
      return false;
    }
  });
}

// Get all data objects (files)
function getGalleryObjectList(callback) {
  var newuri = API_ROOT + 'api/galleryobjects/getgalleryobjectlist';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
    'profileGuid': profileGuid
  };
  ajaxPost(newuri, payload, function(data, done, message) {
    if (done) {
      var galleryObjectGuids = $.parseJSON(data.galleryObjectList);
      $("#fileCount").text(galleryObjectGuids.length);
      $.each(galleryObjectGuids, function(index, value) {
        galleryObjects.push(value);
      });
      callback(true, data);
    } else {
      return false;
    }
  });
}
//
// Gallery object related methods
//
// Get each data object (file)
function getGalleryObject(objectGuid, callback) {
  var newuri = API_ROOT + 'api/galleryobjects/getgalleryobject';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
    'profileGuid': profileGuid,
    'objectGuid': objectGuid,
    'includeThumbnail': 'true',
    'includeImage': 'false'
  };
  ajaxPost(newuri, payload, function(data, done, message) {
    if (done && data) {
      var categories = data.categoryList;
      var createdPretty = moment(data.createdDate).format('dddd, MMMM Do, YYYY');
      var labelHtml = "";
      if (categories) {
        currentObjectLabels = categories + ',';
        var labelArr = categories.split(',');
        for (var i in labelArr) {
          if (i !== '') {
            labelHtml += '<span class="label label-primary">' + labelArr[i] + ' <i class="fa fa-remove delete-label"></i></span>';
          }
        }
        categories += ',';
        labelHtml += '</div><div><input id="' + categories + '" type="text" class="newCategoryInput" placeholder="Add tag"></input></div>';
      } else {
        labelHtml += '</div><div><input id="' + categories + '" type="text" class="newCategoryInput" placeholder="Add tag"></input></div>';
      }
      var noteCount;
      if (data.noteCount == 0){
        noteCount = "";
      } else {
        noteCount = data.noteCount;
      }
      var createdPretty = moment(data.createdDate).format('l');
      var elem = '<div class="user-item" id="' + objectGuid + '"><div class="selected-overlay hide-overlay"><div class="selected-item-green"><i class="fa fa-check-circle-o unselect-item"></i></div></div><div class="item-thumbnail" id="' + data.type + '"><div class="img"><img class="user-item-thumbnail" id="' + createdPretty + '" src="data:image/jpg;base64,' + data.thumbnail + '" style="cursor: pointer;"><div class="overlay"><a href="#" class="expand"></a><a class="close-overlay hidden">x</a></div></div></div><div class="item-specs"><p>' + data.originalFileName + '</p></div><div class="item-controls" id="' + data.thumbnail + '"><a class="add-to" title="Select" href="#"><i class="fa fa-check-circle-o item-icon"></i></a><a href="" alt="Add or view notes" title="Add or view notes" class="add-note"><i class="fa fa-file-text-o item-icon"><span class="note-count">' + noteCount + '</span></i></a><a href="" alt="Download" class="download-item" alt="Download item" title="Download file"><i class="fa fa-download item-icon"></i></a><a class="delete-file" alt="Delete file" title="Delete file"><i class="fa fa-trash item-icon"></i></a></div><div class="item-categories">' + labelHtml + '</div></div>';
      elems += elem;
      $('a').tooltip();
      callback(true);
    }
  });
}
// Delete a gallery object
function deleteGalleryObject(objectGuid) {
  var newuri = API_ROOT + 'api/galleryobjects/deletegalleryobject';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
    'profileGuid': profileGuid,
    'objectGuid': objectGuid
  };
  console.log(payload);
  ajaxPost(newuri, payload, function(data, done, message) {
    console.log(data, done, message);
    if (done) {
      sweetAlert("Deleted file");
      var block = $("#" + objectGuid).remove();
    } else {
      sweetAlert("Whoops!", "Couldn't delete file");
    }
  });
}
// Update a gallery object
function updateGalleryObject(objectGuid, labels) {
  var newuri = API_ROOT + 'api/galleryobjects/updategalleryobject';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
    'profileGuid': profileGuid,
    'objectGuid': objectGuid,
    'categoryList': labels
  };
  ajaxPost(newuri, payload, function(data, done, message) {
    if (done) {
      $("#noteItemLabels").empty();
      labels = labels.substring(0, labels.length - 1);
      var labelArr = labels.split(',')
      labelHtml = "";
      for (var i in labelArr) {
        labelHtml += '<span class="label label-primary" style="margin-right: 5px;">' + labelArr[i] + ' <a class="delete-label"><i class="fa fa-remove"></i></a></span>';
      }
      $("#noteItemLabels").append(labelHtml);
    } else {
      console.log("didnt update");
    }
  });
}
// Update a gallery object
function addTagsToGalleryObject(objectGuid, labels) {
  var newuri = API_ROOT + 'api/galleryobjects/addcategorytogalleryobject';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
    'profileGuid': profileGuid,
    'objectGuid': objectGuid,
    'categoryList': labels
  };
  console.log(payload);
  ajaxPost(newuri, payload, function(data, done, message) {
    if (done) {
      console.log(data, done, message);
      var labelArr = labels.split(',');
      labelHtml = "";
      for (var i in labelArr) {
        labelHtml += '<span class="label label-primary" style="margin-right: 5px;">' + labelArr[i] + ' <a class="delete-label"><i class="fa fa-remove"></i></a></span>';
      }
      $("#" + objectGuid).find("div.item-categories").append(labelHtml);
    } else {
      return false;
    }
  });
}

//
// Circle of Trust related methods
//

// Get circle of trust profiles
function getCircleOfTrustProfiles() {
  var newuri = API_ROOT + 'api/circleoftrusts/getcircleoftrustprofiles';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
    'profileGuid': profileGuid
  };
  ajaxPost(newuri, payload, function(data, done, message) {
    console.log(data, done, message);
    if (done) {
      var profileGuids = data.profileGuids.split(',');
      for (var i in profileGuids) {
        getCircleOfTrustProfileCompound(profileGuids[i]);
      }
    }
  });
}
// Get each profile's info - need emails
function getCircleOfTrustProfileCompound(circleGuid) {
  var newuri = API_ROOT + 'api/circleoftrusts/getcircleoftrustprofilecompound';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
    'profileGuid': profileGuid,
    'circleOfTrustProfileGuid': circleGuid
  };
  ajaxPost(newuri, payload, function(data, done, message) {
    if (done) {
      var email;
      var circleOfTrustProfile = jQuery.parseJSON(data.CircleOfTrustProfile);
      var contactMethodList = jQuery.parseJSON(circleOfTrustProfile.contactMethodList);
      $.each(contactMethodList, function(index, value) {
        var contactMethod = jQuery.parseJSON(value);
        if (contactMethod['label'] == 'Primary Email') {
          email = contactMethod.contactMethodValue;
        }
      });
      if (email != null) {
        console.log(email);
        var html = '<div class="checkbox"><label style="margin-left: 20px;"><input type="checkbox" class="cotAdd" value="' + email + '">' + email + '</label></div>';
        $("#glimpseCircleMembers").append(html);
      }
      //Init cool scrollbar
      $(function() {
        $('#glimpseCircleMembers').slimScroll({
          height: '50px;'
        });
      });
    } else {
      return false;
    }
  });
}

//
//Glimpse
//

// Get all glimpses sent and received
function generateGlimpseList() {
  // That the user sent
  Glimpse.getGlimpses('true');
  // That the user is receiving
  Glimpse.getGlimpses('false');
}

// Glimpse object
var Glimpse = {

    glimpsedesc: '',
    severity: '',
    recipientList: '',
    labelName: '',
    categoryList: '',
    expires: '',
    galleryObjects: '',
    objectGuids: '',
    canAddObjects: '',
    canViewNotes: '',
    canAddNotes: '',
    canEditNotes: '',
    canShare: '',
    glimpseNames: '',

    getGlimpses: function(sent) {
      var newuri = API_ROOT + 'api/glimpses/getglimpses';
      var profileGuid = sessionStorage.getItem("activeProfile");
      var payload = {
        'profileGuid': profileGuid,
        'sent': sent
      };
      ajaxPost(newuri, payload, function(data, done, message) {
        if (done && data) {
          console.log(data.glimpseGuids);
          Glimpse.glimpseGuids = data.glimpseGuids.split(',');
          for (var i in Glimpse.glimpseGuids) {
            var currentGlimpseGuid = Glimpse.glimpseGuids[i];
            Glimpse.getGlimpse(currentGlimpseGuid);
          } //end for loop
        } else {
          return false;
        }
      });
    },

    getGlimpse: function(glimpseGuid) {
      var self = this;
      var newuri = API_ROOT + 'api/glimpses/getglimpse';
      var profileGuid = sessionStorage.getItem("activeProfile");
      var payload = {
        'profileGuid': profileGuid,
        'glimpseGuid': glimpseGuid
      };
      ajaxPost(newuri, payload, function(data, done, message) {
        if (done) {
          name = data.label;
          $("#addToGlimpseDropdown").append('<li role="presentation" id="' + glimpseGuid + '"><a role="menuitem" tabindex="-1" href="#">' + name + '</a></li>');
        }
      });
    },

    getGlimpseFormFields: function(callback) {
      var self = this;
      self.canAddObjects = ($('input[name=addObjectsRadio]:checked', '#addObjects').val());
      self.canViewNotes = ($('input[name=viewNotesRadio]:checked', '#viewNotes').val());
      self.canAddNotes = ($('input[name=addNotesRadio]:checked', '#addNotes').val());
      self.canEditNotes = ($('input[name=editNotesRadio]:checked', '#editNotes').val());
      self.canShare = ($('input[name=canShareRadio]:checked', '#canShare').val());
      self.severity = $("#glimpseUrgency").val();
      self.labelName = $("#glimpseLabel").val();
      self.glimpsedesc = $("#glimpseDescription").val();
      self.recipientList = $("#glimpseRecipients").val();
      self.recipientList += ',';
      $.each($('.cotAdd:checkbox:checked'), function() {
        var add = $(this).val();
        console.log(add);
        self.recipientList += add + ',';
      });
      console.log(self.recipientList);
      this.categoryList = $("#glimpseCategories").val();
      this.expires = $("#datePicked").val();
      Date.prototype.addDays = function(days) {
        this.setDate(this.getDate() + parseInt(days));
        return this;
      };
      var date = new Date();
      date.addDays(this.expires);
      this.expires = date;
      callback(true);
    },

    createGlimpse: function() {
      var self = this;
      var newuri = API_ROOT + 'api/glimpses/createglimpse';
      var profileGuid = sessionStorage.getItem("activeProfile");
      var payload = {
        'profileGuid': profileGuid,
        'label': self.labelName,
        'severity': self.severity,
        'categoryList': self.categoryList,
        'expires': self.expires,
        'recipientList': self.recipientList,
        'galleryObjectList': self.objectGuids,
        'description': self.glimpsedesc,
        'canAddObjectsToGlimpse': self.canAddObjects,
        'canViewGlimpseNotes': self.canViewNotes,
        'canEditGlimpseNotes': self.canEditNotes,
        'canAddNotesToGlimpse': self.canAddNotes,
        'canShareGlimpse': self.canShare
      };
      ajaxPost(newuri, payload, function(data, done, message) {
        if (done && data.Success) {
          $('#glimpseModal').modal('hide');
          sweetAlert("Glimpse sent!");
        } else {
          return false;
          $('#glimpseModal').modal('hide');
          sweetAlert("Glimpse could not be sent");
        }
      });
    },
    addObjectsToGlimpse: function(glimpseGuid, objectList) {
      var newuri = API_ROOT + 'api/glimpses/addobjectstoglimpse';
      var profileGuid = sessionStorage.getItem("activeProfile");
      var payload = {
        'profileGuid': profileGuid,
        'glimpseGuid': glimpseGuid,
        'galleryObjectList': objectList
      };
      ajaxPost(newuri, payload, function(data, done, message) {
        if (done) {
          sweetAlert("Added to glimpse!");
          $("#addToGlimpseModal").modal('hide');
        } else {
          sweetAlert("You do not have permission to add to this glimpse!");
        }
      });
    }
  }
  //
  //Board object
  //
var Board = {
  label: '',
  categories: '',
  galleryObjects: '',
  objectGuids: '',
  description: '',

  clearBoardModal: function() {
    $("#boardLabel").val("");
    $(".bootstrap-tagsinput span").remove();
    $("#boardDescription").val("");
  },
  getBoardFormFields: function(callback) {
    this.label = "";
    this.categories = "";
    this.description = "";
    this.label = $("#boardLabel").val();
    this.categories = $("#boardCategories").val();
    this.description = $("#boardDescription").val();
    callback(true);
  },
  createBoard: function() {
    var newuri = API_ROOT + 'api/boards/createboard';
    var profileGuid = sessionStorage.getItem("activeProfile");
    var payload = {
      'profileGuid': profileGuid,
      'label': Board.label,
      'categoryList': Board.categories,
      'galleryObjectList': Board.objectGuids,
      'description': Board.description
    };
    console.log(payload);
    ajaxPost(newuri, payload, function(data, done, message) {
      if (done) {
        sweetAlert("Board created!");
        $('#boardModal').modal('hide');
        Board.clearBoardModal();
      } else {
        sweetAlert("Whoops!", "Board could not be created");
      }
    });
  }
}

function generateBoardList() {
  var profileGuid = sessionStorage.getItem("activeProfile");
  getUserBoardList(profileGuid);
}

//Get user boards
function getUserBoardList() {
  var newuri = API_ROOT + 'api/boards/getboards';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
    'profileGuid': profileGuid
  };
  ajaxPost(newuri, payload, function(data, done, message) {
    if (done) {
      var boardGuids = $.parseJSON(data.boardList);
      $.each(boardGuids, function(index, value) {
        getUserBoard(value);
      });
    } else {
      return false;
    }
  });
}

// Get each board
function getUserBoard(boardGuid) {
  var newuri = API_ROOT + 'api/boards/getboard';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
    'profileGuid': profileGuid,
    'boardGuid': boardGuid
  };
  ajaxPost(newuri, payload, function(data, done, message) {
    if (done) {
      var name = data.label;
      $("#addToBoardDropdown").append('<li role="presentation" id="' + boardGuid + '"><a role="menuitem" tabindex="-1" href="#">' + name + '</a></li>');
    } else {
      console.log("not done");
    }
  });
}

// Add objects to board
function addObjectsToBoard(boardGuid, objectList) {
  var newuri = API_ROOT + 'api/boards/addobjectstoboard';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
    'profileGuid': profileGuid,
    'boardGuid': boardGuid,
    'galleryObjectList': objectList
  };
  ajaxPost(newuri, payload, function(data, done, message) {
    if (done) {
      sweetAlert("Added items to board");
      $("#addToBoardModal").modal("hide");
    } else {
      sweetAlert("Whoops!", "Couldn't add items to board");
      $("#addToBoardModal").modal("hide");
    }
  });
}

function filteredGalleryObjectList(currentFilter, userInput) {
  var newuri = API_ROOT + 'api/galleryobjects/getgalleryobjectlist';
  var profileGuid = sessionStorage.getItem("activeProfile");
  if (currentFilter === "File Type") {
    var payload = {
      'profileGuid': profileGuid,
      'type': userInput
    };
  } else if (currentFilter === "Uploaded Before") {
    var payload = {
      'profileGuid': profileGuid,
      'createdOnOrBefore': userInput
    };
  } else if (currentFilter === "Uploaded After") {
    var payload = {
      'profileGuid': profileGuid,
      'createdOnOrAfter': userInput
    };
  } else if (currentFilter == "File Name") {
    var payload = {
      'profileGuid': profileGuid,
      'originalFileName': userInput
    };
  } else if (currentFilter === "Category") {
    var payload = {
      'profileGuid': profileGuid,
      'category': userInput
    };
  }
  console.log(payload);
  ajaxPost(newuri, payload, function(data, done, message) {
    console.log(data, done, message);
    if (done && data.galleryObjectList) {
      layoutData(data);
    } else {
      sweetAlert("No matching file found");
    }
  });
}

function filteredGalleryListDates(date1, date2) {
  var newuri = API_ROOT + 'api/galleryobjects/getgalleryobjectlist';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
    'profileGuid': profileGuid,
    'createdOnOrBefore': date2,
    'createdOnOrAfter': date1
  };
  console.log(payload);
  ajaxPost(newuri, payload, function(data, done, message) {
    console.log(data, done, message);
    if (done && data.galleryObjectList) {
      layoutData(data);
    } else {
      sweetAlert("Sorry!", "No files found for those dates");
    }
  });
}

function layoutData(data) {
  console.log(data);
  var galleryObjectGuids = $.parseJSON(data.galleryObjectList);
  $("#fileCount").text(galleryObjectGuids.length);
  galleryObjects = [];
  $.each(galleryObjectGuids, function(index, value) {
    galleryObjects.push(value);
  });
  $("#userDocs").empty();
  galleryCounter = 0;
  $container.masonry();
  startLoadingAnimation();
  for (var i in galleryObjects) {
    getGalleryObject(galleryObjects[i], function(done) {
      if (done) {
        galleryCounter++
        if (galleryCounter % 10 == 0) {
          masonryLayout(function(done) {
            if (done) {
              elems = "";
            }
          });
        } else if (galleryCounter === (galleryObjects.length -1)) {
          masonryLayout(function(done) {
            if (done) {
              elems = "";
              $container.masonry('reloadItems');
              $container.masonry();
              endLoadingAnimation();
            }
          });
        }
      }
    });
  }
}

function startLoadingAnimation(){
  $("#galleryCountSection").append("<div id='loadingSpinner'><span style='margin-right: 10px;'>Please wait while the files load</span><img src='../images/loading.gif'></div>");
}

function endLoadingAnimation(){
  $("#loadingSpinner").remove();
}

//helper function
function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {
    type: contentType
  });
  return blob;
}
//downloadGalleryObject
function downloadGalleryObject(objectGuid) {
  var newuri = API_ROOT + 'api/galleryobjects/downloadgalleryobject';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
    'profileGuid': profileGuid,
    'objectGuid': objectGuid
  };
  ajaxPost(newuri, payload, function(data, done, message) {
    if (done) {
      var a = window.document.createElement('a');
      a.href = window.URL.createObjectURL(b64toBlob(data["fileData"], data["mimeType"], 512));
      a.download = data["filename"];
      a.setAttribute("type", "hidden");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  });
}
