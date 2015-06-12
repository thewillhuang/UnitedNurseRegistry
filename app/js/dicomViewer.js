var stacks = [];
var currentStackIndex = 0;
var seriesIndex = 0;

function resizeStudyViewer() {
  var element = $('#studyViewerRoot').find('.dicom-viewport')[0];
  var viewportWrapper = $('#studyViewerRoot').find('.dicom-viewportWrapper')[0];
  var parent = $(element).parent();
  var studyRow = $('#studyViewerRoot').find('.dicom-studyRow')[0];
  var parentDiv = $('#studyViewerRoot').find('.dicom-viewer')[0];
  var height = $(studyRow).height();
  var width = $(studyRow).width();

  $('#dicomThumbnailSelectorList').height(height - 25);
  $(parentDiv).width(width - 170);
  viewportWrapper.style.width = (parentDiv.style.width - 10) + "px";
  viewportWrapper.style.height = (window.innerHeight - 150) + "px";
  $(studyRow).height(window.innerHeight - 150);
  cornerstone.resize(element, true);
  $(element).bind('mousewheel DOMMouseScroll', function(e) {
    var scrollTo = null;

    if (e.type == 'mousewheel') {
      scrollTo = (e.originalEvent.wheelDelta * -1);
    } else if (e.type == 'DOMMouseScroll') {
      scrollTo = 40 * e.originalEvent.detail;
    }

    if (scrollTo) {
      e.preventDefault();
      $(this).scrollTop(scrollTo + $(this).scrollTop());
    }
  });
}

function dicomViewerClose() {
  var element = $('#studyViewerRoot').find('.dicom-viewport')[0];
  cornerstoneTools.stopClip(element);
  cornerstone.disable(element);
}

$('#dicomViewerModal').on('hidden.bs.modal', dicomViewerClose);

function dicomViewerInit() {
  //console.log("dicomViewerInit: " + JSON.stringify(stacks));
  var seriesList = $('#studyViewerRoot').find('.dicom-thumbnails')[0];
  $(seriesList).empty();
  var element = $('#studyViewerRoot').find('.dicom-viewport')[0];
  var viewportWrapper = $('#studyViewerRoot').find('.dicom-viewportWrapper')[0];
  var parentDiv = $('#studyViewerRoot').find('.dicom-viewer')[0];

  // image enable the dicomImage element
  //cornerstone.disable(element);
  cornerstone.enable(element);
  cornerstone.loadAndCacheImage(stacks[currentStackIndex].imageIds[0]).then(function(image) {
    //Hack to get window levels to show
    var defViewport = cornerstone.getDefaultViewport(element, image);
    defViewport.voi.windowWidth += .01;
    defViewport.voi.windowCenter += .01;
    cornerstone.displayImage(element, image, defViewport);
    //if (stacks[0].frameRate !== undefined) {
    //    cornerstone.playClip(element, stacks[0].frameRate);
    //}
    cornerstoneTools.mouseInput.enable(element);
    cornerstoneTools.mouseWheelInput.enable(element);
    cornerstoneTools.touchInput.enable(element);

    // Enable all tools we want to use with this element
    cornerstoneTools.wwwc.activate(element, 1); // ww/wc is the default tool for left mouse button
    cornerstoneTools.pan.activate(element, 2); // pan is the default tool for middle mouse button
    cornerstoneTools.zoom.activate(element, 4); // zoom is the default tool for right mouse button
    cornerstoneTools.probe.enable(element);
    cornerstoneTools.length.enable(element);
    cornerstoneTools.ellipticalRoi.enable(element);
    cornerstoneTools.rectangleRoi.enable(element);
    cornerstoneTools.wwwcTouchDrag.activate(element);
    cornerstoneTools.zoomTouchPinch.activate(element);


    // stack tools
    cornerstoneTools.addStackStateManager(element, ['playClip']);
    cornerstoneTools.addToolState(element, 'stack', stacks[currentStackIndex]);
    cornerstoneTools.stackScrollWheel.activate(element);
    cornerstoneTools.stackPrefetch.enable(element);

    function disableAllTools() {
      cornerstoneTools.wwwc.disable(element);
      cornerstoneTools.pan.activate(element, 2); // 2 is middle mouse button
      cornerstoneTools.zoom.activate(element, 4); // 4 is right mouse button
      cornerstoneTools.probe.deactivate(element, 1);
      cornerstoneTools.length.deactivate(element, 1);
      cornerstoneTools.angle.deactivate(element, 1);
      cornerstoneTools.ellipticalRoi.deactivate(element, 1);
      cornerstoneTools.rectangleRoi.deactivate(element, 1);
      cornerstoneTools.stackScroll.deactivate(element, 1);
      cornerstoneTools.wwwcTouchDrag.deactivate(element);
      cornerstoneTools.zoomTouchDrag.deactivate(element);
      cornerstoneTools.panTouchDrag.deactivate(element);
      cornerstoneTools.stackScrollTouchDrag.deactivate(element);
    }

    var buttons = $('#studyViewerRoot').find('button');
    // Tool button event handlers that set the new active tool
    $(buttons[0]).on('click touchstart', function() {
      disableAllTools();
      cornerstoneTools.wwwc.activate(element, 1);
      cornerstoneTools.wwwcTouchDrag.activate(element);
    });
    $(buttons[1]).on('click touchstart', function() {
      disableAllTools();
      var viewport = cornerstone.getViewport(element);
      if (viewport.invert === true) {
        viewport.invert = false;
      } else {
        viewport.invert = true;
      }
      cornerstone.setViewport(element, viewport);
    });
    $(buttons[2]).on('click touchstart', function() {
      disableAllTools();
      cornerstoneTools.zoom.activate(element, 5); // 5 is right mouse button and left mouse button
      cornerstoneTools.zoomTouchDrag.activate(element);
    });
    $(buttons[3]).on('click touchstart', function() {
      disableAllTools();
      cornerstoneTools.pan.activate(element, 3); // 3 is middle mouse button and left mouse button
      cornerstoneTools.panTouchDrag.activate(element);
    });
    $(buttons[4]).on('click touchstart', function() {
      disableAllTools();
      cornerstoneTools.stackScroll.activate(element, 1);
      cornerstoneTools.stackScrollTouchDrag.activate(element);
    });
    $(buttons[5]).on('click touchstart', function() {
      disableAllTools();
      cornerstoneTools.length.activate(element, 1);
    });
    $(buttons[6]).on('click touchstart', function() {
      disableAllTools();
      cornerstoneTools.angle.activate(element, 1);
    });
    $(buttons[7]).on('click touchstart', function() {
      disableAllTools();
      cornerstoneTools.probe.activate(element, 1);
    });
    $(buttons[8]).on('click touchstart', function() {
      disableAllTools();
      cornerstoneTools.ellipticalRoi.activate(element, 1);
    });
    $(buttons[9]).on('click touchstart', function() {
      disableAllTools();
      cornerstoneTools.rectangleRoi.activate(element, 1);
    });
    $(buttons[10]).on('click touchstart', function() {
      var frameRate = stacks[currentStackIndex].frameRate;
      if (frameRate === undefined) {
        frameRate = 2;
      }
      cornerstoneTools.playClip(element, frameRate);
    });
    $(buttons[11]).on('click touchstart', function() {
      cornerstoneTools.stopClip(element);
    });


    $(window).resize(function() {
      resizeStudyViewer();
    });
    resizeStudyViewer();

    //button 12 just to trick tooltip into working in modal popup
    try {
      $(buttons[12]).tooltip().data('tooltip').tip().css('z-index', 2080);
    } catch (err) {}
    $(buttons[0]).tooltip();
    $(buttons[1]).tooltip();
    $(buttons[2]).tooltip();
    $(buttons[3]).tooltip();
    $(buttons[4]).tooltip();
    $(buttons[5]).tooltip();
    $(buttons[6]).tooltip();
    $(buttons[7]).tooltip();
    $(buttons[8]).tooltip();
    $(buttons[9]).tooltip();
    $(buttons[10]).tooltip();
    $(buttons[11]).tooltip();

    var seriesList = $('#studyViewerRoot').find('.dicom-thumbnails')[0];
    stacks.forEach(function(stack) {
      var seriesEntry = '<a class="dicom-list-group-item" + ' +
        'oncontextmenu="return false"' +
        'unselectable="on"' +
        'onselectstart="return false;"' +
        'onmousedown="return false;">' +
        '<div class="dicom-csthumbnail"' +
        'oncontextmenu="return false"' +
        'unselectable="on"' +
        'onselectstart="return false;"' +
        'onmousedown="return false;"></div>' +
        "<div class='text-center small'>" + stack.seriesDescription + '</div></a>';
      var seriesElement = $(seriesEntry).appendTo(seriesList);
      var thumbnail = $(seriesElement).find('div')[0];
      cornerstone.enable(thumbnail);
      cornerstone.loadAndCacheImage(stacks[stack.seriesIndex].imageIds[0]).then(function(image) {
        //Hack to get window levels to show
        var defViewport = cornerstone.getDefaultViewport(thumbnail, image);
        defViewport.voi.windowWidth += .01;
        defViewport.voi.windowCenter += .01;
        if (stack.seriesIndex === 0) {
          $(seriesElement).addClass('active');
        }
        cornerstone.displayImage(thumbnail, image, defViewport);
        cornerstone.fitToWindow(thumbnail);
        resizeStudyViewer();
      });
      $(seriesElement).on('click touchstart', function() {
        // make this series visible
        var activeThumbnails = $(seriesList).find('a').each(function() {
          $(this).removeClass('active');
        });
        $(seriesElement).addClass('active');

        cornerstoneTools.stopClip(element);
        cornerstoneTools.stackScroll.disable(element);
        cornerstoneTools.stackScroll.enable(element, stacks[stack.seriesIndex], 0);
        cornerstone.loadAndCacheImage(stacks[stack.seriesIndex].imageIds[0]).then(function(image) {
          //console.log("image: " + JSON.stringify(image));
          //Hack to get window levels to show
          var defViewport = cornerstone.getDefaultViewport(element, image);
          defViewport.voi.windowWidth += .01;
          defViewport.voi.windowCenter += .01;
          currentStackIndex = stack.seriesIndex;
          cornerstone.displayImage(element, image, defViewport);
          cornerstone.fitToWindow(element);
          var stackState = cornerstoneTools.getToolState(element, 'stack');
          stackState.data[0] = stacks[stack.seriesIndex];
          stackState.data[0].currentImageIdIndex = 0;
          cornerstoneTools.stackPrefetch.enable(element);
          $(bottomLeft[1]).text("# Images: " + stacks[stack.seriesIndex].imageIds.length);

          // if (stacks[stack.seriesIndex].frameRate !== undefined) {
          //   cornerstoneTools.playClip(element, stacks[stack.seriesIndex].frameRate);
          // }
        });
      });
    });
  });


  var element = $('#studyViewerRoot').find('.dicom-viewport')[0];
  var parent = $(element).parent();
  var childDivs = $(parent).find('.dicom-overlay');
  var topLeft = $(childDivs[0]).find('div');
  //$(topLeft[0]).text(studyObj.patientName);
  //$(topLeft[1]).text(studyObj.patientId);
  var topRight = $(childDivs[1]).find('div');
  //$(topRight[0]).text(studyObj.studyDescription);
  //$(topRight[1]).text(studyObj.studyDate);
  var bottomLeft = $(childDivs[2]).find('div');
  var bottomRight = $(childDivs[3]).find('div');

  function onNewImage(e, detail) {
    //console.log("onNewImage");
    // if we are currently playing a clip then update the FPS
    var playClipToolData = cornerstoneTools.getToolState(element, 'playClip');
    if (playClipToolData !== undefined && playClipToolData.data.length > 0 && playClipToolData.data[0].intervalId !== undefined && detail.frameRate !== undefined) {
      //$(bottomLeft[0]).text("FPS: " + Math.round(detail.frameRate));
      //console.log('frameRate: ' + e.detail.frameRate);
    } else {
      if ($(bottomLeft[0]).text().length > 0) {
        $(bottomLeft[0]).text("");
      }
    }
    $(bottomLeft[2]).text("Image #" + (stacks[currentStackIndex].currentImageIdIndex + 1) + "/" + stacks[currentStackIndex].imageIds.length);
    //resizeStudyViewer();
  }
  $(element).on("CornerstoneNewImage", onNewImage);

  function onImageRendered(e, detail) {
    //console.log(JSON.stringify(e));
    //console.log(JSON.stringify(detail));
    //console.log("windowWidth: " + detail.image.windowWidth);
    $(bottomRight[0]).text("Zoom: " + detail.viewport.scale.toFixed(2));
    //$(bottomRight[1]).text("WW/WC: " + Math.round(detail.viewport.voi.windowWidth) + "/" + Math.round(detail.viewport.voi.windowCenter));
    //$(bottomLeft[1]).text("Render Time: " + detail.renderTimeInMs + " ms");
  }
  $(element).on("CornerstoneImageRendered", onImageRendered);

  // prevent scrolling on ios
  document.body.addEventListener('touchmove', function(e) {
    e.preventDefault();
  });
}

function dicomViewerLoadSeriesObject(series, seriesNum, metaData) {
  var stack = {
    seriesDescription: metaData["SeriesDescription"],
    stackId: seriesNum,
    imageIds: [],
    seriesIndex: seriesNum,
    currentImageIdIndex: 0,
    frameRate: 2
  }

  for (var instance = 0; instance < series.length; instance++) {
    var imageId = series[instance];
    stack.imageIds[instance] = "lifespeed://" + imageId;
  }
  stacks[seriesNum] = stack;
}


function dicomViewerLoadStudy(studyID) {
  stacks = new Array();
  currentStackIndex = 0;
  seriesIndex = 0;
  $('#dicomViewerModal').modal();
  var newuri = API_ROOT + 'api/galleryobjects/getstudyserieslist';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
    'profileGuid': profileGuid,
    'studyGuid': studyID,
  };
  ajaxPost(newuri, payload, function(data, done, message) {
    if (done) {
      var seriesList = $.parseJSON(data.galleryObjectList);
      var initWaitFunc = function() {
        //console.log("stacks.length: " + stacks.length + "; seriesList.length: " + seriesList.length);
        if (stacks.length < seriesList.length) {
          setTimeout(function() {
            initWaitFunc();
          }, 100);
        } else {
          dicomViewerInit();
        }
      }
      setTimeout(function() {
        initWaitFunc();
      }, 100);
      for (var seriesNum = 0; seriesNum < seriesList.length; seriesNum++) {
        dicomViewerLoadSeries(seriesList[seriesNum], seriesNum);
      }
      var metaData = JSON.parse(data.metaData);
      var element = $('#studyViewerRoot').find('.dicom-viewport')[0];
      var parent = $(element).parent();
      var childDivs = $(parent).find('.dicom-overlay');
      var topLeft = $(childDivs[0]).find('div');
      var topRight = $(childDivs[1]).find('div');
      $(topLeft[0]).text("Patient Name: " + metaData["PatientName"]);
      $(topLeft[1]).text("Patient ID: " + metaData["PatientID"]);
      $(topRight[0]).text("Study Description: " + metaData["StudyDescription"]);
      $(topRight[1]).text("Study Date: " + metaData["StudyDate"]);
    }
  });
}

function dicomViewerLoadSeries(seriesID, seriesNum) {
  var newuri = API_ROOT + 'api/galleryobjects/getseriesinstancelist';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
    'profileGuid': profileGuid,
    'seriesGuid': seriesID,
  };
  ajaxPost(newuri, payload, function(data, done, message) {
    if (done) {
      var instanceList = $.parseJSON(data.galleryObjectList);
      var metaData = JSON.parse(data.metaData);
      dicomViewerLoadSeriesObject(instanceList, seriesNum, metaData);
    }
  });
}
