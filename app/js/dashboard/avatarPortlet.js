// Enable Popovers
$(function() {
  $('[data-toggle="popover"]').popover({
    html : true,
    viewport: '.page-content',
    animation: true
  });
});

$('body').on('click', function(e) {
  $('[data-toggle="popover"]').each(function() {
    //the 'is' for buttons that trigger popups
    //the 'has' for icons within a button that triggers a popup
    if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
      $(this).popover('hide');
    }
  });

});

// Flow for filling avatar portlet
function fillAvatarPortlet() {
  // Empty portlet body --- necessary in case new photos uploaded
  $("#headSearch").attr('data-content', "");
  $("#armSearch").attr('data-content', "");
  $("#legSearch").attr('data-content', "");
  $("#torsoSearch").attr('data-content', "");

  getAvatarObjectList("#headSearch");
  getAvatarObjectList("#armSearch");
  getAvatarObjectList("#legSearch");
  getAvatarObjectList("#torsoSearch");
}

// Get all data objects (files)
function getAvatarObjectList(category) {
  var newuri = API_ROOT + 'api/galleryobjects/getgalleryobjectlist';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
    'profileGuid': profileGuid,
  };
  if (category == "#headSearch") {
    payload["category"] = "Head";
  } else if (category == "#armSearch") {
    payload["category"] = "Arm";
  } else if (category == "#legSearch") {
    payload["category"] = "Leg";
  } else if (category == "#torsoSearch") {
    payload["category"] = "Torso";
  }
  ajaxPost(newuri, payload, function(data, done, message) {
    if (done) {
      var galleryObjectGuids = [];
      try {
        galleryObjectGuids = $.parseJSON(data.galleryObjectList);
        $.each(galleryObjectGuids, function(index, value) {
          //console.log(value);
          getAvatarObject(category, value);
          //console.log(avatarObjects);
        });
      } catch (err) {
        return false;
      }
    }
  });
}
// Get each data object (file)
function getAvatarObject(category, objectGuid) {
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
      var searchItem = '<div class="user-item-avatarSearch" ';
      if (data.type == "DICOM_STUDY") {
        searchItem += 'onClick="dicomViewerLoadStudy(&quot;' + objectGuid + '&quot;);">';
      } else {
        searchItem += 'onClick="imageViewerLoadStudy(&quot;' + objectGuid + "&quot;, &quot;" + data.type + '&quot;);">';
      }
      searchItem += '<img src="data:image/jpg;base64,' + data.thumbnail + '"></div>';
      $(category).attr('data-content', $(category).attr('data-content') + searchItem);
    }
  });
}
