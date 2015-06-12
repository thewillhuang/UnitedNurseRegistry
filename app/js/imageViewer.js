var imageViewerSlices = [];
var imageViewerRotation = 0;
var imageViewerImageHeight = 0;
var imageViewerImageWidth = 0;

function imageViewerLoadStudy(objectGuid, objectType) {
  if (objectType == "DICOM_STUDY") {
    dicomViewerLoadStudy(objectGuid);
    return;
  } else if (objectType == "DOCX" || objectType == "DOC" || objectType == "PDF" || objectType == "TXT") {
    $("#imageViewerRotateLeftButton").attr("style", "display: none;");
    $("#imageViewerRotateRightButton").attr("style", "display: none;");
    //LOAD DOCUMENT TYPE
    var newuri = API_ROOT + 'api/galleryobjects/getseriesinstancelist';
    var profileGuid = sessionStorage.getItem("activeProfile");
    var payload = {
      'profileGuid': profileGuid,
      'seriesGuid': objectGuid,
    };
    $("#imageViewerImageDiv").empty();
    ajaxPost(newuri, payload, function(data, done, message) {
      if (done) {
        var instanceList = $.parseJSON(data.galleryObjectList);
        imageViewerSlices.length = instanceList.length;
        for (i in instanceList) {
          (function(i) {
            imageViewerSlices[i] = "";
            var newuri2 = API_ROOT + 'api/galleryobjects/getgalleryobject';
            var payload2 = {
              'profileGuid': profileGuid,
              'objectGuid': instanceList[i],
              'includeThumbnail': 'false',
              'includeImage': 'true'
            };
            ajaxPost(newuri2, payload2, function(data, done, message) {
              var imgString = "data:image/jpeg;base64," + data.image;
              imageViewerSlices[i] = imgString;
              var full = true;
              for (j in imageViewerSlices) {
                if (imageViewerSlices[j] == "") full = false;
              }
              if (full) {
                for (j in imageViewerSlices) {
                  var img = $('<img>');
                  img.attr('src', imageViewerSlices[j]);
                  img.attr('style', "pointer-events: none; max-height:100%; max-width:100%; margin-bottom:20px; box-shadow: 1px 1px 1px 1px; display:block; margin-left:auto; margin-right:auto;");
                  img.appendTo('#imageViewerImageDiv');
                }
              }
            });
          })(i);
        }
      }
    });
  } else {
    $("#imageViewerRotateLeftButton").attr("style", "");
    $("#imageViewerRotateRightButton").attr("style", "");

    //LOAD IMAGE TYPE
    var newuri = API_ROOT + 'api/galleryobjects/getgalleryobject';
    var profileGuid = sessionStorage.getItem("activeProfile");
    var payload = {
      'profileGuid': profileGuid,
      'objectGuid': objectGuid,
      'includeThumbnail': 'false',
      'includeImage': 'true'
    };
    $("#imageViewerImageDiv").empty();
    ajaxPost(newuri, payload, function(data, done, message) {
      if (done) {
        var imgString = "data:image/jpeg;base64," + data.image;
        var img = $('<img>');
        img.on('load', function() {
          imageViewerImageWidth = this.width;
          imageViewerImageHeight = this.height;
          console.log(imageViewerImageWidth);
        });
        img.attr('src', imgString);
        img.attr('style', "pointer-events: none; max-height:100%; max-width:100%; margin-bottom:10px; box-shadow: 1px 1px 1px 1px; display:block; margin:auto;");
        img.appendTo('#imageViewerImageDiv');
      }
    });
  }
  imageViewerRotation = 0;
  rotatedImageViewerImageDivStyle(imageViewerRotation);
  $("#imageViewerModal").modal();
}

function imageViewerRotateLeftButtonClicked() {
  imageViewerRotation -= 1;
  rotatedImageViewerImageDivStyle(imageViewerRotation);
}

function imageViewerRotateRightButtonClicked() {
  imageViewerRotation += 1;
  rotatedImageViewerImageDivStyle(imageViewerRotation);
}

function rotatedImageViewerImageDivStyle(rot) {
  var styleString = "pointer-events: none; margin-left: auto; margin-right: auto; ";
  if (imageViewerRotation != 0) {
    styleString += "-webkit-transform: rotate(" + (90 * rot) + "deg); ";
    styleString += "-moz-transform: rotate(" + (90 * rot) + "deg); ";
    styleString += "-o-transform: rotate(" + (90 * rot) + "deg); ";
    styleString += "-ms-transform: rotate(" + (90 * rot) + "deg); ";
    styleString += "transform: rotate(" + (90 * rot) + "deg); ";
  }
  if (imageViewerRotation % 2 != 0) {
    padding = (imageViewerImageWidth - imageViewerImageHeight) / 2;
    if (padding > 0) {
      styleString += "margin-top: " + padding + "px; margin-bottom: " + padding + "px; ";
    }
  }
  console.log(styleString);
  $("#imageViewerImageDiv").attr('style', styleString);
}
