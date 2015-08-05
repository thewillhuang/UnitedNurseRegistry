
function ShowGlimpseModal() {
    var studyIds = "";
    $('#GlimpseSelectedStudyList').empty();
    $('#hdnStudyList').empty();

    for (i in SelectedStudiesForGlimpse)
    {
        var percent = i * 100 / SelectedStudiesForGlimpse.length;
        if (SelectedStudiesForGlimpse.length == 1) percent = 30;
        var thumbnail = '<img src="' + StudyThumbnailDictionary[SelectedStudiesForGlimpse[i]] + '"' + ' style="position:absolute;top:30%;left:' + percent + '%;' + 'z-index:' + percent +';border:3;bordercolor:#999999;"/>';
        $('#GlimpseSelectedStudyList').append(thumbnail);

        studyIds += ';' + SelectedStudiesForGlimpse[i];
    }

    $('#hdnStudyList').val(studyIds);

    $('#glimpseModal').modal('show');
}

function ShowDicomHTML5ViewModal(seriesID) {
    $('#dicomHTML5ViewModal').on('shown.bs.modal', function() { dicomHTML5LoadSeries(seriesID) });
    $('#dicomHTML5ViewModal').on('hidden.bs.modal', function() {
        var element = $('#studyViewerRoot').find('.viewport')[0];
        cornerstoneTools.stopClip(element);
        window.location.reload();
        //cornerstoneTools.removeToolState(element, 'stack', stacks[currentStackIndex]);
    });
    $('#dicomHTML5ViewModal').modal('show');
}


