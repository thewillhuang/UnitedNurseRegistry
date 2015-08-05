
//global variables... 
var CurrentImageMode = '';
var SelectedStudiesForGlimpse = [];

function OnClickImageRepoNamed() {
    //drill down into it...
    CurrentStudyGUID = $(this).attr('data-studyguid');
    if (CurrentImageMode == 'glimpse') {
        var i = $.inArray(CurrentStudyGUID, SelectedStudiesForGlimpse);
        if (i >= 0) {
            SelectedStudiesForGlimpse.splice($.inArray(CurrentStudyGUID, SelectedStudiesForGlimpse), 1);
        }
        else
        {
            SelectedStudiesForGlimpse.push(CurrentStudyGUID);
        }
        UpdateGlimpseShareButtonState();
        $(this).toggleClass('imgRepoSelected');
    } else {
        LoadSeriesList();
        $('#imageRepoWrapper').hide();
        $('#imageRepoDetails').show();
    }
}

function UpdateGlimpseShareButtonState() {
    if (SelectedStudiesForGlimpse.length < 1)
    {
        $("#GlimpseGalleryShareButton").prop("disabled", true);
    }
    else
    {
        $("#GlimpseGalleryShareButton").prop("disabled", false);
    }
}

function InitImageRepo() {
    //get the mode into the javascript environment, accessible from other scripts depending on which ones...
    CurrentImageMode = $('#hdnMode').val();
    SelectedStudiesForGlimpse = [];
    UpdateGlimpseShareButtonState();

    if (CurrentImageMode == 'glimpse') {
        //GLIMPSE MODE
        $('#staticNewImageRepo').hide();
        $('#imageRepoTopLevelWrapper').css('margin-top', '-40px')
        $('#imageRepoTopButtonArea').show();

        //attach the handler for on-click functionality which differs based on the 'mode'
        $('.imgRepoNamed').click(OnClickImageRepoNamed);
        //load the glimpse modal content
        //$('#glimpseModal').load(GLOBAL_WEB_ROOT + "modal/glimpse-send.html", function() {
        $('#glimpseModal').load(GLOBAL_WEB_ROOT + "modal/glimpse-send.aspx", function() {
            ComponentsjQueryUISliders.init();
        });
    }
    else {
        //DEFAULT MODE
        $('#staticNewImageRepo').hide();
        $('#imageRepoTopLevelWrapper').css('margin-top', '0px')
        $('#imageRepoTopButtonArea').hide();

        //attach the handler for on-click functionality which differs based on the 'mode'
        $('.imgRepoNamed').click(OnClickImageRepoNamed);
        //$('#dicomHTML5ViewModal').empty();
        //$('#dicomHTML5ViewModal').load(GLOBAL_WEB_ROOT + "modal/dicom-html5-view.aspx");
        InitDicomViewerModal();
    }




    $('#frm_study_title').editable({
        mode: 'inline',
        url: GLOBAL_WEB_ROOT + 'webservices/dash.ashx?fc=savestudyname&studyguid=' + CurrentStudyGUID,
        type: 'text',
        pk: 1,
        success: function(response, newValue) {
            ////logic for tweaking the UX based on values from the save response... 
            //if ($(this).attr('data-name') == 'firstname') {
            //    $('#profilePopoverFirstName').html(newValue);
            //    $('#lblFName').html(newValue);
        },
        display: function(value, sourceData) {
            $(this).html(value);
        }
    });


    $('#frm_study_desc').editable({
        mode: 'inline',
        url: GLOBAL_WEB_ROOT + 'webservices/dash.ashx?fc=savestudydesc&studyguid=' + CurrentStudyGUID,
        type: 'textarea',
        pk: 1,
        success: function(response, newValue) {
            ////logic for tweaking the UX based on values from the save response... 
            //if ($(this).attr('data-name') == 'firstname') {
            //    $('#profilePopoverFirstName').html(newValue);
            //    $('#lblFName').html(newValue);
        },
        display: function(value, sourceData) {
            $(this).html(value);
        }
    });



    $('.ShowAllSeriesContents').click(function() {
        $(this).parent().siblings().each(function() {
            //first remove the noshow class...
            $(this).removeClass('noshow');

            //in each of the sibling DIV's will be the <A> child, and in each <A> will be an image... 
            var $img = $(this).children().first().children().first();
            var imgSrc = $img.attr('data-imagesrc');
            $img.attr('src', imgSrc);
        });
        $(this).remove();
    });


    ApplyXEditablePluginToAllSeries();

    AttachInputLoader();

    //for each of the series that we created and rendered into the screen, call the AssignHTML5UploadHandlerToElementByID method, passing in that series panel-body DIV element's ID string... 
    //this is required because you can not bind based on class-name,... only based on #ID value... 
    $('.imageRepoSeriesItems').each(function(index) {
        var id = $(this).attr('id');
        AssignHTML5UploadHandlerToElementByID(id);
    });


}

function GenerateSeriesBlock(seriesGUID, name)
{
    var block = '<div style="border-style:solid; border-color:#999999;" id="imageRepoSeriesWrapper_' + seriesGUID + '">';
    block += '<div class="panel panel-default"><a href="#" id="frm_series_1" class="xEditableSeries panel-title" style="font-size: 14px;" data-series-guid="' + seriesGUID + '"></a>SeriesID: ' + name + '</div>';
    block += '<div class="panel-body imageRepoSeriesItems" id="frm_series_items_' + seriesGUID + '" data-series-guid="' + seriesGUID + '">';                       
    block += '<div class="col-xs-4 col-md-2"><a href="javascript:ShowDicomHTML5ViewModal(\'' + seriesGUID + '\')" id="thumbnail_series_' + seriesGUID + '" class="thumbnail"></a></div>';
    block += '</div></div>';

    return block;
}

function LoadSeriesList() {
    var wsurl = GLOBAL_WEB_ROOT + 'webservices/dcmImage.ashx?fc=serieslist&studyguid=' + CurrentStudyGUID;
    $.ajax({
        type: "GET",
        url: wsurl,
        dataType: "json",
        success: function(data) {
            if (data.ResultCode == 'SUCCESS') {
                $('#imageRepoSeriesList').empty();
                var seriesList = data.Data["seriesList"];
                for (i in seriesList) {
                    var seriesguid = seriesList[i]["ID"];
                    var name = seriesList[i]["MainDicomTags"]["SeriesDescription"];
                    var block = GenerateSeriesBlock(seriesguid, name);
                    $('#imageRepoSeriesList').after(block);
                    LoadSeriesThumbnail(seriesguid);
                }
                if (data.Data["study"] != null)
                {
                    $('#frm_study_desc').empty();
                    $('#frm_study_desc').text(data.Data["study"]["MainDicomTags"]["StudyDescription"]);
                }
            }
            else {
                alert("Cannot connect to Lifespeed Servers: " + data.ResultMessage);
            }
        }
    });
}


var studyList;
function LoadStudyList()
{
    var wsurl = GLOBAL_WEB_ROOT + 'webservices/dcmImage.ashx?fc=studylist';
    $.ajax({
        type: "GET",
        url: wsurl,
        dataType: "json",
        success: function(data) {
            //alert(JSON.stringify(data));
            if (data.ResultCode == 'SUCCESS') {
                var studyList = data.Data["studyList"];
                $('#imgRepoStudyList').empty();
                for (i in studyList) {
                    var study = studyList[i];
                    var block = '<div class="imgRepo imgRepoNamed" data-studyguid="' + study["ID"] + '">' + study["MainDicomTags"]["StudyDescription"] + '</div>';
                    $('#imgRepoStudyList').after(block);
                    LoadStudyThumbnail(study["ID"]);
                }
            }
            else
            {
                alert("Cannot connect to Lifespeed Servers: " + data.ResultMessage);
            }
        }
    });
}

function LoadSeriesThumbnail(seriesguid) {
    var wsurl = GLOBAL_WEB_ROOT + 'webservices/dcmImage.ashx?fc=thumbseries&seriesguid=' + seriesguid;
    $.ajax({
        type: "GET",
        url: wsurl,
        dataType: "json",
        success: function(data) {
            if (data.ResultCode == 'SUCCESS') {
                var imageString = data.ResultMessage;
                $('#thumbnail_series_' + seriesguid).append('<img src="data:image/jpg;base64,' + imageString + '"/>');
                //$('[data-seriesguid=' + seriesguid + ']').click(OnClickImageRepoNamed);
            }
            else {
                alert("Cannot connect to Lifespeed Servers: " + data.ResultMessage);
            }
        }
    });
}

function LoadStudyThumbnail(studyguid) {
    var wsurl = GLOBAL_WEB_ROOT + 'webservices/dcmImage.ashx?fc=thumbstudy&studyguid=' + studyguid;
    $.ajax({
        type: "GET",
        url: wsurl,
        dataType: "json",
        success: function(data) {
            if (data.ResultCode == 'SUCCESS') {
                var imageString = "data:image/jpg;base64," + data.ResultMessage;
                StudyThumbnailDictionary[studyguid] = imageString;
                $('[data-studyguid=' + studyguid + ']').css("background-image", "url(" + imageString + ")");
                $('[data-studyguid=' + studyguid + ']').click(OnClickImageRepoNamed);
            }
            else {
                alert("Cannot connect to Lifespeed Servers: " + data.ResultMessage);
            }
        }
    });
}

function ApplyXEditablePluginToAllSeries() {

    $('.xEditableSeries').editable({
        mode: 'inline',
        url: GLOBAL_WEB_ROOT + 'webservices/dash.ashx?fc=saveseriesname',
        type: 'text',
        pk: 1,
        params: function(params) {
            //originally params contain pk, name and value... but here we add one more...
            params.seriesguid = $(this).attr('data-series-guid');
            return params;
        },
        success: function(response, newValue) {
            ////logic for tweaking the UX based on values from the save response... 
            //if ($(this).attr('data-name') == 'firstname') {
            //    $('#profilePopoverFirstName').html(newValue);
            //    $('#lblFName').html(newValue);
        },
        display: function(value, sourceData) {
            $(this).html(value);
        }
    });
}

function OpenNewImageRepo() {
    //drill down into it...
    $('#imageRepoWrapper').hide();
    $('#imageRepoDetails').show();

    //set to negative one... as a new study... 
    CurrentStudyGUID = -1;

    //clear out the existing study... 
    $('#frm_study_title').html();
    $('#frm_study_desc').html();

    //clear out all series...
    $('#imageRepoSeriesWrapper').empty();

    //call the method to add a new one...
    AddNewSeries();
}

function AddNewSeries() {

    var newSeriesGUID = '';

    //perform the insertion to the database of this new series... then get back it's GUID and use it in the new HTML below... 
    var wsurl = GLOBAL_WEB_ROOT + 'webservices/dash.ashx?fc=addseries';
    $.ajax({
        type: "GET",
        url: wsurl,
        dataType: "json",
        success: function(data) {
            if (data.ResultCode == 'SUCCESS') {

                //set the local javascript variable to be the result GUID from this recently saved/created entity...
                newSeriesGUID = data.ResultObjectGUID;

                var block = '';
                block += '<div id="imageRepoSeriesWrapper">' +
                    '<div class="panel panel-default" >' +
                        '<div class="panel-heading" contains-buttons" style="height:50px;">' +
                            '<div class="btn-group pull-right">' +
                                '<a href="javascript:LaunchViewer(\'' + newSeriesGUID + '\');" class="btn btn-default btn-sm" style="margin-right:10px;"><i class="fa fa-external-link-square"></i> Launch Viewer</a>' +
                                '<a href="javascript:BrowseLocal(\'' + newSeriesGUID + '\');" class="btn btn-default btn-sm"><i class="fa fa-plus"></i> Add Images</a>' +
                            '</div>' +
                            '<h4 class="panel-title">Series - <a href="#" id="frm_series_' + newSeriesGUID + '" class="xEditableSeries" data-series-guid="' + newSeriesGUID + '">New Series</a></h4>' +
                        '</div>' +
                        '<div class="panel-body imageRepoSeriesItems" id="frm_series_items_' + newSeriesGUID + '" data-series-guid="' + newSeriesGUID + '">' +
                        '</div>' +
                    '</div>';

                $('#imageRepoSeriesWrapper').append(block); 

                //re-apply the x-editable plugin to the title of this newly added series...
                ApplyXEditablePluginToAllSeries();

                //re-apply the html5 uploader to that newly created series area...
                AssignHTML5UploadHandlerToElementByID('frm_series_items_' + newSeriesGUID);
            }
        }
    });

}
var CurrentlyUploadingImagesIntoSeries = '';

function BrowseLocal(seriesGUID) {
    CurrentlyUploadingImagesIntoSeries = seriesGUID;
    $('#hdnInputFileUpload').click();
}


function AddThumbnailToSeries(seriesGUID, thumbPath) {

    //override the preview image if it was a dicom file...
    if (thumbPath.indexOf('data:application/octet-stream;base64') != -1) {
        thumbPath = 'images/dicom.png';
    }

    //DICOM:    data:application/octet-stream;base64
    //JPEG:     data:image/jpeg;base64
    //PNG:      data:image/jpg;base64



    var tTemplate = '<div class="col-xs-4 col-md-2">' +
        '<a href="#" class="thumbnail">' +
            '<img src="' + thumbPath + '" alt="..." />' +
        '</a>' +
    '</div>';

    $('#frm_series_items_' + seriesGUID).append(tTemplate);
}


function AttachInputLoader() {

    //bind to a click event to upload a new file and save it...
    $('#hdnInputFileUpload').delay(2000).bind('change', function() {
        //this.files[0].size gets the size of your file.
        file = this.files[0];
        fileSize = this.files[0].size;
        var reader = new FileReader();

        //we can create a preview image...
        reader.onload = function(e) {
            AddThumbnailToSeries(CurrentlyUploadingImagesIntoSeries,e.target.result);
        }

        reader.readAsDataURL(this.files[0]);

        UploadThisFileFromInput($(this).attr("id"));
    });

}

var newProjectFileCounter = 0;

//for the old-school way to upload files...
function UploadThisFileFromInput(fileId) {

    LogThis('UploadThisFileFromInput: ' + fileId);

    var filename = "";
    var fullPath = document.getElementById(fileId).value;

    if (fullPath) {
        var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
        filename = fullPath.substring(startIndex);
        if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
            filename = filename.substring(1);
        }
    }

    var newFileName = slugify(filename) + "_" + newGUID() + "." + getExtension(filename);
    var fullFilePath = newFileName;

    //assign the path to the hidden field... 
    $('#hdnInputFileName').val(fullFilePath);
    //this one used for capturing just the old-school file uploader's new file name for re-capturing it on progress events... since it's just one of these at a time... 
    $('#hdnInputOriginalFileName').val(filename);

    newProjectFileCounter++;

    var fileSizeString = '0kb';
    if (fileSize < 1024) {
        fileSizeString = '1 kb';
    }
    else {
        //because it's in bytes, we have to divide by 1024 to get kilobytes
        fileSizeString = Math.round((fileSize / 1024)) + 'kb';
    }

    //gets a string image path for this file type...
    var fileTypeImage = determineFileTypeIcon(filename);

    //this creates the javascript file object and adds into a global array variable...
    CreateAndShowFileUploadProgress(fileTypeImage, fileSizeString, filename, null, 0, newFileName)

    //declare the new XMLHttpRequest
    var xmlHttpRequest = new XMLHttpRequest();

    //now set the onprogress event to capture this file's upload progress so we can report on it locally
    //xmlHttpRequest.onprogress = updateProgressFromOldSchoolFileUploadField;
    xmlHttpRequest.upload.addEventListener("loadstart", updateProgressFromOldSchoolFileUploadField, false);
    xmlHttpRequest.upload.addEventListener("progress", updateProgressFromOldSchoolFileUploadField, false);
    xmlHttpRequest.upload.addEventListener("load", updateProgressFromOldSchoolFileUploadField, false);

    //set the post and open it up
    xmlHttpRequest.open("POST", fileUploadSourcePathUrl + '?newFileName=' + newFileName + '&newFileSize=' + fileSizeString, true);

    if (file.getAsBinary) {
        var data = dashes + boundary + crlf + "Content-Disposition: form-data;" + "name=\"" + "uploadedFile" + "\";" + "filename=\"" + unescape(encodeURIComponent(file.name)) + "\"" + crlf + "Content-Type: application/octet-stream" + crlf + crlf + file.getAsBinary() + crlf + dashes + boundary + dashes;
        xmlHttpRequest.setRequestHeader("Content-Type", "multipart/form-data;boundary=" + boundary);
        xmlHttpRequest.sendAsBinary(data);
    } else if (window.FormData) {
        var formData = new FormData();
        formData.append(unescape(encodeURIComponent(file.name)), file);
        xmlHttpRequest.send(formData);
    }
}

//reporting progress locally and remotely... only use this from the old-school way of one-at-a-time selection of files using the 'input, type=file' upload control... 
function updateProgressFromOldSchoolFileUploadField(e) {
    if (e.lengthComputable) {
        //PROGRESS EVENT! 
        var percentCompleteRounded = Math.ceil((e.loaded / e.total) * 100);

        //since this is the old-school file upload, grab out the file name from the hidden field... 
        var filename = $('#hdnInputOriginalFileName').val();

        LogThis('Upload progress event for file: ' + filename + ' at ' + percentCompleteRounded + '%');

        //figures out which progress DIV to update, then updates its progress...
        UpdateLocalProgressBarForUploadFile(filename, percentCompleteRounded);
    }
    else {
        //this means that e.lengthComputable false...
    }
}
