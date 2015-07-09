var galleryObjects = [];

// Flow for filling gallery image portlet
function fillGalleryPortlet() {
  // Empty portlet body --- necessary in case new photos uploaded
  $("#galleryPortletBody").empty();
  // Empty gallery object array
  galleryObjects.length = 0;
  getGalleryObjectList(function(done) {
    if (done) {
      for (var i=0; i<10; i++) {
        getGalleryObject(galleryObjects[i]);
      }
    } else {
      return false;
    }
  });
}
function fillRemainingGalleryPortlet(){
  for (var i=10; i<galleryObjects.length; i++) {
    getGalleryObject(galleryObjects[i]);
  }
}
// Get all data objects (files)
function getGalleryObjectList(callback) {
  var newuri = API_ROOT + 'api/galleryobjects/getgalleryobjectlist';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
    'profileGuid': profileGuid,
  };
  ajaxPost(newuri, payload, function(data, done, message) {
    if (done) {
      var galleryObjectGuids = $.parseJSON(data.galleryObjectList);
      $.each(galleryObjectGuids, function(index, value) {
        var html = '<div class="user-item-dashboard" id="' + value + '"></div>';
        $("#galleryPortletBody").append(html);
        galleryObjects.push(value);
        $("#"+value).hide();
      });
      callback(true);
      if (data){
        //Init cool scrollbar
        $(function() {
          $('#galleryPortletBody').slimScroll({
            height: '500px;'
          });
        });
      }
    } else {
      callback(false);
    }
  });
}
// Get each data object (file)
function getGalleryObject(objectGuid) {
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
      var elem = $('<img src="data:image/jpg;base64,' + data.thumbnail + '" style="width: 100%; height: 100%; cursor: pointer;">');
      $(elem).on('click', function() {
        if (data.type == "DICOM_STUDY") {
          dicomViewerLoadStudy(objectGuid);
        } else {
          imageViewerLoadStudy(objectGuid, data.type);
        }
      });
      $("#"+objectGuid).show().append(elem);
    }
  });
}
// Scroll to load more
$("#galleryPortletBody").scroll(function(){
  fillRemainingGalleryPortlet();
  $("#galleryPortletBody").unbind("scroll");
});
