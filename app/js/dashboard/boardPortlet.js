function fillBoardPortlet() {
  getBoards();
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
        getBoard(value);
      });
      //Init cool scrollbar
      $(function() {
        $('#boardPortletBody').slimScroll({
          height: '650px;'
        });
      });
    } else {
      return false;
    }
  });
}

// Get each board
function getBoard(boardGuid) {
  var newuri = API_ROOT + 'api/boards/getboard';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
    'profileGuid': profileGuid,
    'boardGuid': boardGuid
  };
  ajaxPost(newuri, payload, function(data, done, message) {
    console.log(data, done, message);
    if (done && (!data.Error)) {
      var html = "";
      var html = '<div class="user-board" id="' + data.description + '"><div class="row"><div class="board-info col-md-6"><h2 style="display: inline-block;">' + data.label + '</h2></div></div><div class="row" id="' + data.label + '"><div class="board-items col-md-12" id="' + data.guid + '"></div></div></div>';
      $("#boardPortletBody").append(html);
      $(function() {
        $('.board-items').slimScroll({
          height: '250px;'
        });
      });
      //Get all the images
      var galleryObjects = $.parseJSON(data.galleryObjectList);
      for (var i in galleryObjects) {
        getBoardGalleryObject(galleryObjects[i], boardGuid);
      }
    } else {
      return false;
    }
  });
}
// Get board images
function getBoardGalleryObject(objectGuid, boardGuid) {
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
      if (data.type !== undefined) {
        var categories = data.categoryList;
        var createdPretty = moment(data.createdDate).format('dddd, MMMM Do, YYYY');
        var createdPretty = moment(data.createdDate).format('l');
        var elem = $('<div class="dashboard-user-board-item" id="' + objectGuid + '"><div class="user-board-item-thumbnail" id="' + data.type + '"><div class="img"><img class="item-thumbnail" id="' + createdPretty + '" src="data:image/jpg;base64,' + data.thumbnail + '" style="cursor: pointer;"><div class="overlay"><a href="#" class="expand"></a><a class="close-overlay hidden">x</a></div></div></div><div class="item-specs"><p>' + data.originalFileName + '</p></div></div>');
        $(elem).on('click', function() {
          if (data.type == "DICOM_STUDY") {
            dicomViewerLoadStudy(objectGuid);
          } else {
            imageViewerLoadStudy(objectGuid, data.type);
          }
        });
        $("#" + boardGuid).append(elem);
      }
    } else {
      return false;
    }
  });
}
