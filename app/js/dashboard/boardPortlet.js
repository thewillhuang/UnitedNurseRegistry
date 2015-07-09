var boardArr = [];

function fillBoardPortlet() {
  $("#boardPortletBody").empty();
  getBoards(function(done, data){
    if (done){
      boardArr = $.parseJSON(data.boardList);
      console.log(boardArr);
      for (var i=0; i<boardArr.length; i++){
        var html = '<div class="user-board" id="' + boardArr[i] + '"></div>';
        $("#boardPortletBody").append(html);
        $("#"+boardArr[i]).hide();
      }
      for (var i=0; i<2; i++){
        getBoard(boardArr[i]);
      }
    }
  });
}
function fillRemainingBoardPortlet(){
  for (var i=2; i<boardArr.length; i++) {
    getBoard(boardArr[i]);
  }
}
//Get user boards
function getBoards(callback) {
  var newuri = API_ROOT + 'api/boards/getboards';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
    'profileGuid': profileGuid
  };
  ajaxPost(newuri, payload, function(data, done, message) {
    if (done && data.boardList) {
      $(function() {
        $('#boardPortletBody').slimScroll({
          height: '600px;'
        });
      });
      callback(true, data);
    } else {
      callback(false);
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
    if (done) {
      if (data.Error){
        $("#"+boardGuid).remove();
        } else {
        var html = "";
        var html = '<div class="row"><div class="board-info col-md-6"><h2 style="display: inline-block;">' + data.label + '</h2></div></div><div class="row" id="' + data.label + '"><div class="board-items board-items-shorter col-md-12" id="' + data.guid + '"></div></div><div class="row"><div class="col-md-12"><a class="show-more-board-items pull-right" title="Show More"><i class="fa fa-ellipsis-h"></i></a></div></div>';
        $("#" + boardGuid).show().append(html);
        //Get all the images
        var galleryObjects = $.parseJSON(data.galleryObjectList);
        for (var i in galleryObjects) {
          var html = '<div class="dashboard-user-board-item" id="' + galleryObjects[i] + '"></div>';
          $("#"+boardGuid).find(".board-items").append(html);
          $("#"+boardGuid).find(".board-items").find("#"+galleryObjects[i]).hide();
          getBoardGalleryObject(galleryObjects[i], boardGuid);
        }
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
        var elem = $('<div class="user-board-item-thumbnail" id="' + data.type + '"><div class="img"><img class="item-thumbnail" id="' + createdPretty + '" src="data:image/jpg;base64,' + data.thumbnail + '" style="cursor: pointer;"><div class="overlay"><a href="#" class="expand"></a><a class="close-overlay hidden">x</a></div></div></div><div class="item-specs"><p>' + data.originalFileName + '</p></div>');
        $(elem).on('click', function() {
          if (data.type == "DICOM_STUDY") {
            dicomViewerLoadStudy(objectGuid);
          } else {
            imageViewerLoadStudy(objectGuid, data.type);
          }
        });
        $("#" + boardGuid).find("#" + data.guid).show().append(elem);
        $('a').tooltip();
      }
    } else {
      return false;
    }
  });
}
// Display more or less items in each board
$(document).on('click', '.show-more-board-items', function(){
  var className = $(this).children("i").attr("class");
  $(this).closest(".user-board").find(".board-items").toggleClass("board-items-shorter");
  if (className === "fa fa-ellipsis-h") {
    $(this).children("i").attr("class", "fa fa-ellipsis-v");
    $(this).attr("title", "Show Less");
    $(this).attr("data-original-title", "Hide");
  } else {
    $(this).children("i").attr("class", "fa fa-ellipsis-h");
    $(this).attr("title", "Show More");
    $(this).attr("data-original-title", "Show More");
  }
});
// Scroll to load more
$("#boardPortletBody").scroll(function(){
  fillRemainingBoardPortlet();
  $("#boardPortletBody").unbind("scroll");
});
