$(document).ready(function() {
  //First thing we do on each page
  getUserDefaultProfile();
  //Get user boards
  getBoards();
  //Hide filters on multi-board view
  // Hide filtering until use
  $("#filterArea").hide();
  $("#filterText").hide();
  $("#filterDate").hide();
  $("#filterDate2").hide();
  //User submitting a note to add to gallery object
  $("#addNoteBtn").click(function() {
    var objectGuid = $(".single-board").attr("id");
    createNote(currentNoteObject, currentNoteType, category);
  });
  // // Glimpse share length slider
  // $("#glimpseSlider").slider({
  //   formatter: function(value) {
  //     return (value);
  //   }
  // });
  // $("#glimpseSlider").on('slideStop', function(ev) {
  //   Glimpse.expires = ($(this).val());
  // });
  // $("#submitGlimpseBtn").click(function() {
  //   //Check for required fields
  //   Glimpse.getGlimpseFormFields(function(done) {
  //     if (done) {
  //       Glimpse.createGlimpse();
  //     }
  //   });
  // });

});

//Globals
var currentBoardObject = "";
var currentBoardGuid = "";
var currentNoteObject = "";
var currentNoteType = "";
var singleBoardHtml = "";
var boardGalleryCounter = 0;
var currentNoteType = "";

//Glimpse
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
    self.categoryList = $("#glimpseCategories").val();
    //Image guids
    $(".single-board-items .single-board-item img").each(function() {
      self.objectGuids += ($(this).attr('id') + ",");
    });
    var now = Date.now();
    var hours = Glimpse.expires;
    Date.prototype.addHours = function(h) {
      this.setHours(this.getHours() + h);
      return this;
    }
    var expirationDate = new Date().addHours(hours);
    Glimpse.expires = expirationDate;
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
        sweetAlert("Glimpse could not be sent, please try again.");
      }
    });
  }
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

//Get user boards
function getBoards() {
  var newuri = API_ROOT + 'api/boards/getboards';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
    'profileGuid': profileGuid
  };
  ajaxPost(newuri, payload, function(data, done, message) {
    if (done) {
      var boardGuids = $.parseJSON(data.boardList);
      $.each(boardGuids, function(index, value) {
        getBoard(value, function(done, data) {
          if (done) {
            var html = "";
            var categories = data.categoryList.split(',');
            var html = '<div class="user-board" id="' + data.description + '"><div class="row"><div class="board-info col-md-6"><a class="single-board-view" style="display: inline-block: margin-left: 5px; color: #00a1d3;" title="View board details"><i class="fa fa-chevron-right"></i></a><h2 style="display: inline-block;">' + data.label + '</h2></div><div class="board-labels col-md-6" id="' + categories + '">';
            for (var i in categories) {
              var cathtml = '<span class="label label-primary">' + categories[i] + '</span>';
              html += cathtml;
            }
            html += '</div></div><div class="row" id="' + data.label + '"><div class="board-items col-md-12" id="' + data.guid + '"></div></div></div>';
            $("#userBoardsArea").append(html);
            //Init cool scrollbar
            $(function() {
              $('.board-items').slimScroll({
                height: '250px;'
              });
            });
            $(function() {
              $('.board-labels').slimScroll({
                height: '40px;'
              });
            });
            //Get all the images
            var galleryObjects = $.parseJSON(data.galleryObjectList);
            for (var i in galleryObjects) {
              getBoardGalleryObject(galleryObjects[i], value, function(done, data) {
                if (done) {
                  if (data.noteCount == 0){
                    noteCount = "";
                  } else {
                    noteCount = data.noteCount;
                  }
                  var categories = data.categoryList;
                  var createdPretty = moment(data.createdDate).format('dddd, MMMM Do, YYYY');
                  var createdPretty = moment(data.createdDate).format('l');
                  var elem = '<div class="user-board-item" id="' + data.guid + '"><div class="user-board-item-thumbnail" id="' + data.type + '"><div class="img"><img class="item-thumbnail" id="' + createdPretty + '" src="data:image/jpg;base64,' + data.image + '" style="cursor: pointer;"><div class="overlay"><a href="#" class="expand"></a><a class="close-overlay hidden">x</a></div></div></div><div class="item-specs"><p>' + data.originalFileName + '</p></div><div class="item-controls" id="' + data.image + '"><a href="" alt="Add or view notes" title="Add or view notes" class="add-note"><i class="fa fa-file-text-o item-icon"><span class="note-count">' + noteCount + '</span></i></a><a href="" alt="Download file" title="Download file" class="download-item"><i class="fa fa-download item-icon"></i></a><a alt="Delete file" title="Delete file" class="delete-file"><i class="fa fa-trash item-icon"></i></a></div></div>';
                  $("#" + value).append(elem);
                }
              });
              //Init tooltips
              $('a').tooltip();
            }
          }
        });
      });
    } else {
      return false;
    }
  });
}

// Get each board
function getBoard(boardGuid, callback) {
  var newuri = API_ROOT + 'api/boards/getboard';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
    'profileGuid': profileGuid,
    'boardGuid': boardGuid
  };
  ajaxPost(newuri, payload, function(data, done, message) {
    if (done && data) {
      callback(true, data);
    } else {
      return false;
    }
  });
}
// Get board images
function getBoardGalleryObject(objectGuid, boardGuid, callback) {
  var newuri = API_ROOT + 'api/galleryobjects/getgalleryobject';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
    'profileGuid': profileGuid,
    'objectGuid': objectGuid,
    'includeThumbnail': 'false',
    'includeImage': 'true'
  };
  ajaxPost(newuri, payload, function(data, done, message) {
    if (done && data) {
      if (data.type !== undefined) {
        callback(true, data);
      }
    } else {
      return false;
    }
  });
}

function showSingleBoardView(boardGuid) {
  currentBoardGuid = boardGuid;
  $("div.item-controls").html("");
  $("#userBoardsArea").empty();
  $("#filterArea").show();
  $("#myBoardsTitle").text("");
  $("#myBoardsTitle").prepend("<i class='fa fa-chevron-left' id='boardBack' style='display: inline-block; float: left; margin-right: 10px; cursor: pointer;'>");
  // Get board with guid
  getBoard(boardGuid, function(done, data) {
    if (done) {
      $("#myBoardsTitle").append(data.label);
      singleBoardHtml = "";
      html2 = '<div class="single-board" id="' + boardGuid + '"><div class="single-board-title">' + data.label + '</div><div class="single-board-tools"><a class="add-board-note"><i class="fa fa-2x fa-file-text-o"></i></a><a class="edit-board" id="' + data.categoryList + '"><i class="fa fa-pencil-square-o fa-2x"></i></a><a class="delete-board"><i class="fa fa-2x fa-trash"></i></a></div><div class="single-board-description">' + data.description + '</div>';
      html2 += '<div class="single-board-items"></div></div>';
      $("#userBoardsArea").append(html2);
      var galleryObjects = $.parseJSON(data.galleryObjectList);
      var counter = 0;
      for (var i in galleryObjects) {
        getBoardGalleryObject(galleryObjects[i], boardGuid, function(done, data) {
          if (done) {
            if (data.noteCount == 0){
              noteCount = "";
            } else {
              noteCount = data.noteCount;
            }
            var createdPretty = moment(data.createdDate).format('dddd, MMMM Do, YYYY');
            var createdPretty = moment(data.createdDate).format('l');
            var elem = '<div class="single-board-item" id="' + data.guid + '"><div class="single-board-item-thumbnail" id="' + data.type + '"><div class="img"><img class="item-thumbnail" id="' + createdPretty + '" src="data:image/jpg;base64,' + data.image + '" style="cursor: pointer;"><div class="overlay"><a href="#" class="expand"></a><a class="close-overlay hidden">x</a></div></div></div><div class="item-specs"><p>' + data.originalFileName + '</p></div><div class="item-controls" id="' + data.image + '"><a href="" alt="Add or view notes" title="Add or view notes" class="single-add-note"><i class="fa fa-file-text-o item-icon"><span class="note-count">' + noteCount + '</span></i></a><a href="" alt="Download file" title="Download file" class="single-download-item"><i class="fa fa-download item-icon"></i></a><a class="single-delete-file" alt="Delete file" title="Delete file"><i class="fa fa-trash item-icon"></i></a></div></div>';
            $(".single-board-items").append(elem);
            counter++
            console.log(counter, galleryObjects.length);
            if (counter === galleryObjects.length) {
              console.log("equal");
              var $container = $('.single-board-items').imagesLoaded(function() {
                // initialize Packery after all images have loaded
                $container.packery({
                  "itemSelector": ".single-board-item"
                });
                $container.find('.single-board-item').each(function(i, itemElem) {
                  // make element draggable with Draggabilly
                  var draggie = new Draggabilly(itemElem);
                  // bind Draggabilly events to Packery
                  $container.packery('bindDraggabillyEvents', draggie);
                });
              });
              //Init tooltips
              $('a').tooltip();
            }
          }
        });
      }
    }
  });
}

function layoutBoardData(data) {
  boardGuid = data.guid;
  // Clear out board items to replace with filtered ones
  $(".single-board-items").empty();
  var galleryObjects = $.parseJSON(data.galleryObjectList);
  var counter = 0;
  var elems = [];
  for (var i in galleryObjects) {
    getBoardGalleryObject(galleryObjects[i], boardGuid, function(done, data) {
      if (done) {
        var createdPretty = moment(data.createdDate).format('dddd, MMMM Do, YYYY');
        var createdPretty = moment(data.createdDate).format('l');
        var elem = '<div class="single-board-item" id="' + data.guid + '"><div class="single-board-item-thumbnail" id="' + data.type + '"><div class="img"><img class="item-thumbnail" id="' + createdPretty + '" src="data:image/jpg;base64,' + data.image + '" style="cursor: pointer;"><div class="overlay"><a href="#" class="expand"></a><a class="close-overlay hidden">x</a></div></div></div><div class="item-specs"><p>' + data.originalFileName + '</p></div><div class="item-controls" id="' + data.image + '"><a href="" alt="Add a note" class="single-add-note"><i class="fa fa-copy item-icon"></i></a><a href="" alt="Download" class="single-download-item"><i class="fa fa-download item-icon"></i></a><a class="single-delete-file"><i class="fa fa-trash item-icon"></i></a></div></div>';
        $(".single-board-items").append(elem);
        counter++
        console.log(counter, galleryObjects.length);
        if (counter === galleryObjects.length) {
          console.log("equal");
          var $container = $('.single-board-items').imagesLoaded(function() {
            // initialize Packery after all images have loaded
            $container.packery({
              "itemSelector": ".single-board-item"
            });
            $container.packery().find('.single-board-item').each(function(i, itemElem) {
              // make element draggable with Draggabilly
              var draggie = new Draggabilly(itemElem);
              // bind Draggabilly events to Packery
              $container.packery('bindDraggabillyEvents', draggie);
            });
          });
          $container.packery('reloadItems');
          $container.packery();
        }
      }
    });
  }
}

// Delete a board
function deleteBoard(boardGuid) {
  var newuri = API_ROOT + 'api/boards/deleteboard';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
    'profileGuid': profileGuid,
    'boardGuid': boardGuid
  };
  ajaxPost(newuri, payload, function(data, done, message) {
    if (done) {
      console.log(data.Success, data.Error);
      sweetAlert("Board deleted!");
      location.reload();
    } else {
      sweetAlert("Whoops!", "Failed to delete board");
    }
  });
}
// Delete a file from a board
function deleteFromBoard(objectGuid, boardGuid) {
  var newuri = API_ROOT + 'api/boards/removeobjectsfromboard';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
    'profileGuid': profileGuid,
    'boardGuid': boardGuid,
    'galleryObjectList': objectGuid + ','
  };
  ajaxPost(newuri, payload, function(data, done, message) {
    if (done) {
      sweetAlert("Deleted item from board!");
      $("#" + objectGuid).remove();
    } else {
      return false;
    }
  });
}
// Update board
function updateBoard(boardGuid, label, description, categoryList) {
  var newuri = API_ROOT + 'api/boards/updateboard';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
    'profileGuid': profileGuid,
    'boardGuid': boardGuid,
    'label': label,
    'categoryList': categoryList,
    'description': description
  };
  ajaxPost(newuri, payload, function(data, done, message) {
    if (done) {
      sweetAlert("Updated board!");
      location.reload();
    }
  });
}
// Get filtered gallery object list
function filteredGalleryObjectList(currentBoardGuid, currentFilter, userInput) {
    var newuri = API_ROOT + 'api/galleryobjects/getcontainergalleryobjectlist';
    var profileGuid = sessionStorage.getItem("activeProfile");
    if (currentFilter === "File Type") {
      var payload = {
        'profileGuid': profileGuid,
        'containerGuid': currentBoardGuid,
        'objectType': 'Board',
        'type': userInput
      };
    } else if (currentFilter === "Uploaded Before") {
      var payload = {
        'profileGuid': profileGuid,
        'containerGuid': currentBoardGuid,
        'objectType': 'Board',
        'createdOnOrBefore': userInput
      };
    } else if (currentFilter === "Uploaded After") {
      var payload = {
        'profileGuid': profileGuid,
        'containerGuid': currentBoardGuid,
        'objectType': 'Board',
        'createdOnOrAfter': userInput
      };
    } else if (currentFilter == "File Name") {
      var payload = {
        'profileGuid': profileGuid,
        'containerGuid': currentBoardGuid,
        'objectType': 'Board',
        'originalFileName': userInput
      };
    } else if (currentFilter === "Category") {
      var payload = {
        'profileGuid': profileGuid,
        'containerGuid': currentBoardGuid,
        'objectType': 'Board',
        'category': userInput
      };
    }
    console.log(payload);
    ajaxPost(newuri, payload, function(data, done, message) {
      console.log(data, done, message);
      if (done && data.galleryObjectList) {
        layoutBoardData(data);
      } else {
        sweetAlert("Not matching file found");
      }
    });
  }

  function filteredGalleryListDates(currentBoardGuid, date1, date2) {
    var newuri = API_ROOT + 'api/galleryobjects/getcontainergalleryobjectlist';
    var profileGuid = sessionStorage.getItem("activeProfile");
    var payload = {
      'profileGuid': profileGuid,
      'containerGuid': currentBoardGuid,
      'objectType': 'Board',
      'createdOnOrBefore': date2,
      'createdOnOrAfter': date1
    };
    console.log(payload);
    ajaxPost(newuri, payload, function(data, done, message) {
      console.log(data, done, message);
      if (done && data.galleryObjectList){
        layoutBoardData(data);
      } else {
        sweetAlert("Sorry!", "No files found for those dates");
      }
    });
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
