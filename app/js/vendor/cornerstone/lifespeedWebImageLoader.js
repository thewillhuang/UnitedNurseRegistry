/*! cornerstoneWebImageLoader - v0.3.2 - 2014-11-11 | (c) 2014 Chris Hafey | https://github.com/chafey/cornerstoneWebImageLoader */
//
// This is a cornerstone image loader for web images such as PNG and JPEG
//

(function ($, cornerstone) {

    "use strict";

    var canvas = document.createElement('canvas');
    var lastImageIdDrawn = "";


    function createImageObject(image, imageId, metaData)
    {
        // extract the attributes we need
        var rows = image.naturalHeight;
        var columns = image.naturalWidth;

        function getPixelData()
        {
            var imageData = getImageData();
            var imageDataData = imageData.data;
            var numPixels = image.naturalHeight * image.naturalWidth;
            var storedPixelData = new Uint8Array(numPixels * 4);
            var imageDataIndex = 0;
            var storedPixelDataIndex = 0;
            for(var i=0; i < numPixels; i++) {
                storedPixelData[storedPixelDataIndex++] = imageDataData[imageDataIndex++];
                storedPixelData[storedPixelDataIndex++] = imageDataData[imageDataIndex++];
                storedPixelData[storedPixelDataIndex++] = imageDataData[imageDataIndex++];
                storedPixelData[storedPixelDataIndex++] = 255; // alpha
                imageDataIndex++;
            }
            return storedPixelData;
        }

        function getImageData()
        {
            var context;
            if(lastImageIdDrawn !== imageId) {
                canvas.height = image.naturalHeight;
                canvas.width = image.naturalWidth;
                context = canvas.getContext('2d');
                context.drawImage(image, 0, 0);
                lastImageIdDrawn = imageId;
            }
            else {
                context = canvas.getContext('2d');
            }
            var imageData = context.getImageData(0, 0, image.naturalWidth, image.naturalHeight);
            return imageData;
        }

        function getCanvas()
        {
            if(lastImageIdDrawn === imageId) {
                return canvas;
            }

            canvas.height = image.naturalHeight;
            canvas.width = image.naturalWidth;
            var context = canvas.getContext('2d');
            context.drawImage(image, 0, 0);
            lastImageIdDrawn = imageId;
            return canvas;
        }

        function getImage()
        {
            return image;
        }

        // Extract the various attributes we need
        var imageObject = {
            imageId : imageId,
            minPixelValue: 0.0,
            maxPixelValue: 255.0,
            origMinPixelValue: metaData.smallestImagePixelValue,
            origMaxPixelValue : metaData.largestImagePixelValue,
            slope: 1.0,
            intercept: 0.0,
            origSlope: metaData.rescaleSlope,
            origIntercept: metaData.rescaleIntercept,
            windowCenter: 128.0,
            windowWidth: 256.0,
            origWindowCenter: parseInt(metaData.windowCenter, 10),
            origWindowWidth: parseInt(metaData.windowWidth, 10),
            render: cornerstone.renderColorImage,
            getPixelData: getPixelData,
            getImageData: getImageData,
            getCanvas: getCanvas,
            getImage: getImage,
            //storedPixelData: extractStoredPixels(image),
            rows: rows,
            columns: columns,
            height: rows,
            width: columns,
            color: true,
            columnPixelSpacing: parseFloat(metaData.pixelSpacingX),
            rowPixelSpacing: parseFloat(metaData.pixelSpacingY),
            invert: false,
            sizeInBytes : rows * columns * 4 // we don't know for sure so we over estimate to be safe
        };

        return imageObject;
    }

    // Loads an image given a url to an image
    function loadImage(imageId) {
        // create a deferred object
        var deferred = $.Deferred();

        var objectGuid = imageId.replace("lifespeed://", "");
        var newuri = API_ROOT + 'api/galleryobjects/getgalleryobject';
        var profileGuid = sessionStorage.getItem("activeProfile");
        var payload = {
          'profileGuid': profileGuid,
          'objectGuid': objectGuid,
          'includeThumbnail': 'false',
          'includeImage': 'true'
        };
        ajaxPost(newuri, payload, function(data, done, message){
          if (done) {
            var image = new Image();
            //console.log(data.metaData);
            var metaData = JSON.parse(data.metaData);
            image.onload = function() {
                var imageObject = createImageObject(image, objectGuid, metaData);
                deferred.resolve(imageObject);
            };
            image.onerror = function() {
                deferred.reject();
            };
            image.src = "data:image/jpg;base64," + data.image;
          } else {
            console.log(data.responseText);
          }
        });

        return deferred;
    }

    // steam the http and https prefixes so we can use standard web urls directly
    cornerstone.registerImageLoader('lifespeed', loadImage);

    return cornerstone;
}($, cornerstone));
