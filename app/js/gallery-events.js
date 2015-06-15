//
//Object events
//
//Select all objects
$("#selectAll").click(function() {
  $('.add-to').toggleClass('board-clicked');
  $(".add-to i").toggleClass('highlight');
  $(".user-item").find(".selected-overlay").toggleClass('hide-overlay');
});
//Add category label
$(document).on('keyup', '.newCategoryInput', function(event) {
  //update object with label
  if (event.keyCode == 13) {
    var categories = $(this).attr("id");
    var label = $(this).val();
    var letters = /[a-z]/i.test(label);
    if (letters) {
      categories += label + ',';
      $(this).attr("id", categories);
      var objectGuid = $(this).closest(".user-item").attr("id");
      updateGalleryObject(objectGuid, categories);
      var block = $(this).closest(".user-item").find("div.item-categories");
      block.empty();
      $(this).val('');
      var labelArr = categories.substring(0, categories.length - 1).split(',');
      for (var i in labelArr) {
        if (i !== '') {
          var labelHtml = '<span class="label label-primary">' + labelArr[i] + ' <i class="fa fa-remove delete-label"></i></span>';
          block.prepend(labelHtml);
        }
      }
    }
  }
});
// Delete category label
$(document).on('click', '.delete-label', function() {
  var self = this;
  var objectGuid = $(this).closest(".user-item").attr("id");
  var categories = $(this).closest(".user-item").find(".newCategoryInput").attr("id");
  // categories += ',';
  $(this).closest("span").remove();
  var label = $(this).closest("span").text();
  label = label.trim();
  label += ',';
  if (categories.indexOf(label) === -1) {
    console.log("no label found.");
  } else {
    categories = categories.replace(label, '');
    updateGalleryObject(objectGuid, categories);
    $("#" + objectGuid).find(".newCategoryInput").attr("id", categories);
    var check = $("#" + objectGuid).find(".newCategoryInput").attr("id");
  }
});
// Add tags to objects
$("#addTagsBtn").click(function(){
  $("#addTagsModal").modal('show');
});

$("#addTagsSubmit").click(function(){
  addObjegitctGuids = "";
  var labels = $("#addTagsInput").val();
  $(".highlight").each(function() {
    var checkedGuid = $(this).closest("div.user-item").attr("id");
    addObjectGuids += checkedGuid + ",";
  });
  addObjectGuids = addObjectGuids.split(',');
  for (var i in addObjectGuids){
    addTagsToGalleryObject(addObjectGuids[i], labels);
  }
  $("#addTagsModal").modal("hide");
  sweetAlert("Files updated");
});

// Delete gallery object
$(document).on('click', '.delete-file', function() {
  var objectGuid = $(this).closest(".user-item").attr("id");
  swal({   title: "Are you sure you want to delete this file?",   text: "You will not be able to recover this file!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){
    deleteGalleryObject(objectGuid);
  });
});
// Highlight icon yellow if clicked
$(document).on('click', '.add-to', function(event) {
  event.preventDefault();
  $(this).toggleClass('board-clicked');
  $(this).children("i").toggleClass('highlight');
  $(this).closest(".user-item").find(".selected-overlay").toggleClass("hide-overlay");
});
$(document).on('click', '.unselect-item', function(event){
  $(this).closest(".user-item").find(".add-to").toggleClass('board-clicked');
  $(this).closest(".user-item").find(".add-to i").toggleClass('highlight');
  $(this).closest(".user-item").find(".selected-overlay").toggleClass("hide-overlay");
});
// Delete multiple gallery objects button
$("#deleteItems").click(function() {
  $(".board-clicked").each(function() {
    var objectGuid = $(this).closest("div.user-item").attr("id");
    deleteGalleryObject(objectGuid);
  });
});

//
//Glimpse events
//

// Add members to glimpse
$(document).on('click', '.addMemberToGlimpse', function() {
  if (this.checked) {
    var value = $(this).attr("id");
    Glimpse.recipientList += value.trim() + ',';
  }
});
// Handle add to glimpse checkbox changes
$(".addGlimpseCheck").change(function() {
  if (this.checked) {
    var itemId = (this.id);
    Glimpse.galleryObjects += itemId;
  }
});
// Glimpse slider
$("#glimpseSlider").on('slideStop', function(ev) {
  Glimpse.expires = ($(this).val());
});
// Create a glimpse click event
$("#createGlimpseBtn").click(function() {
  getCircleOfTrustProfiles();
  Glimpse.galleryObjects = "";
  Glimpse.objectGuids = "";
  $("#userFiles").empty();
  $("#glimpseCircleMembers").empty();
  $('.glimpse-clicked').each(function() {
    var checkedGuid = $(this).closest("div.user-item").attr("id");
    var checkedImg = $(this).closest("div.item-controls").attr("id");
    Glimpse.galleryObjects += '<img src="data:image/jpg;base64,' + checkedImg + '" class="glimpseImage">';
    Glimpse.objectGuids += checkedGuid + ",";
  });
  $("#userFiles").append(Glimpse.galleryObjects);
});
$("#submitGlimpseBtn").click(function() {
  //Check for required fields
  Glimpse.getGlimpseFormFields(function(done) {
    if (done) {
      Glimpse.createGlimpse();
    }
  });
});
// Add object to glimpse
$("#addToGlimpseBtn").click(function() {
  addGalleryObjects = "";
  addObjectGuids = "";
  $("#addToGlimpseDropdown").empty();
  $("#addToGlimpseImages").empty();
  $(".glimpse-clicked").each(function() {
    var checkedGuid = $(this).closest("div.user-item").attr("id");
    var checkedImg = $(this).closest("div.item-controls").attr("id");
    addGalleryObjects += '<img src="data:image/jpg;base64,' + checkedImg + '" class="glimpseImage">';
    addObjectGuids += checkedGuid + ",";
  });
  $("#addToGlimpseImages").append(addGalleryObjects);
  //Init cool scrollbar
  $(function() {
    $('#addToGlimpseImages').slimScroll({
      height: '100px;'
    });
  });
  generateGlimpseList();
});
// Selecting board to add files/images to
$(document).on('click', '#addToGlimpseDropdown li a', function(event) {
  var glimpseGuid = $(this).parent("li").attr("id");
  Glimpse.addObjectsToGlimpse(glimpseGuid, addObjectGuids);
});

//
//Board events
//

// Selecting board to add files/images to
$(document).on('click', '#addToBoardDropdown li a', function(event) {
  var boardGuid = $(this).parent("li").attr("id");
  addObjectsToBoard(boardGuid, addObjectGuids);
});
// Add object to board
$("#addToBoardBtn").click(function() {
  addGalleryObjects = "";
  addObjectGuids = "";
  $("#addToBoardDropdown").empty();
  $("#addToBoardImages").empty();
  $(".board-clicked").each(function() {
    var checkedGuid = $(this).closest("div.user-item").attr("id");
    var checkedImg = $(this).closest("div.item-controls").attr("id");
    addGalleryObjects += '<img src="data:image/jpg;base64,' + checkedImg + '" class="glimpseImage">';
    addObjectGuids += checkedGuid + ",";
  });
  $("#addToBoardImages").append(addGalleryObjects);
  //Init cool scrollbar
  $(function() {
    $('#addToBoardImages').slimScroll({
      height: '100px;'
    });
  });
  generateBoardList();
});
// Create a board click event
$("#createBoardBtn").click(function() {
  Board.galleryObjects = "";
  Board.objectGuids = "";
  $("#boardFiles").empty();
  $(".board-clicked").each(function() {
    var checkedGuid = $(this).closest("div.user-item").attr("id");
    var checkedImg = $(this).closest("div.item-controls").attr("id");
    Board.galleryObjects += '<img src="data:image/jpg;base64,' + checkedImg + '" class="glimpseImage img-thumbnail">';
    Board.objectGuids += checkedGuid + ",";
  });
  $("#boardFiles").append(Board.galleryObjects);
  //Init cool scrollbar
  $(function() {
    $('#boardFiles').slimScroll({
      height: '100px;'
    });
  });
});
$("#submitBoardBtn").click(function() {
  Board.getBoardFormFields(function(done) {
    if (done) {
      Board.createBoard();
    }
  });
});

//
//Note events
//

//User submitting a note to add to gallery object
$("#addNoteBtn").click(function() {
  var objectType = 'GalleryObject';
  var objectGuid = $(".note-container").attr("id");
  createNote(objectGuid, objectType, category);
});
var $container = $('#userDocs');
$container.on('click', '.user-item', function() {
  $(this).toggleClass('is-expanded');
});
// Note modal
$(document).on('click', '.add-note', function(event) {
  if ($("#addNotesTab").hasClass("active-note-link")){
    $("#addNotesTab").toggleClass("active-note-link");
    $("#viewNotesTab").toggleClass("active-note-link");
  }
  $("#addNotesRow").hide();
  $("#viewNotesRow").show();
  event.preventDefault();
  $("#noteImage").empty();
  var noteImage = $(this).closest("div.item-controls").attr("id");
  var imageGuid = $(this).closest("div.user-item").attr("id");
  $(".note-container").attr("id", imageGuid);
  // Get any previous notes for the item
  $("#previousNotes").empty();
  getObjectNotes(imageGuid, 'GalleryObject');
  $('#noteModal').modal('show');
  $('#addNotesRow').hide();
});
// Note dropdown event
$(document).on('click', '#noteDropdownList li a', function(event) {
  event.preventDefault();
  category = $(this).text();
  getCategory(category);
});
// Delete a note
$(document).on('click', '.delete-this-note', function(event) {
  event.preventDefault();
  var noteGuid = $(this).attr("id");
  var objectType = 'GalleryObject';
  deleteNote(noteGuid, objectType);
});
// Edit a note click
$(document).on('click', '.edit-this-note', function() {
  var objectGuid = $(".note-container").attr("id");
  var noteGuid = $(this).next().attr("id");
  displayEditNote(objectGuid, noteGuid, 'GalleryObject');
});
$(document).on('click', '#editNoteSubmit', function() {
  var noteGuid = $(".edit-note").attr("id");
  var imageGuid = $('.note-container').attr("id");
  updateNote(noteGuid, 'GalleryObject', function(done) {
    if (done) {
      $("#previousNotes").empty();
      getObjectNotes(imageGuid, 'GalleryObject');
    }
  })
});

//
//User item tools functionality
//
$(".zoomItem").click(function(event) {
  event.preventDefault();
  if (!itemZoomed) {
    $(this).closest(".user-item").addClass("zoom-item");
    itemZoomed = true;
  } else {
    $(this).closest(".user-item").removeClass("zoom-item");
    itemZoomed = false;
  }
});

//
// Handle DICOM viewer
$(document).on('click', '.item-thumbnail', function() {
  if ($(this).attr("id") == "DICOM_STUDY") {
    var objectGuid = $(this).parent("div.user-item").attr("id");
    dicomViewerLoadStudy(objectGuid);
  } else {
    var objectGuid = $(this).parent("div.user-item").attr("id");
    imageViewerLoadStudy(objectGuid, $(this).attr("id"));
  }
});
//
// Handle Download
$(document).on('click', '.download-item', function(event) {
  event.preventDefault();
  var objectGuid = $(this).closest("div.user-item").attr("id");
  downloadGalleryObject(objectGuid);
});

//Information about object on hover

$(document).on('mouseenter', '.img', function() {
  $(this).addClass("hover");
  var type = $(this).closest(".item-thumbnail").attr("id");
  var date = $(this).find(".user-item-thumbnail").attr("id");
  $(this).find(".expand").html('<span>Type: ' + type + '</span><br><span>Added: ' + date + '</span>');
});
$(document).on('mouseleave', '.img', function() {
  $(this).removeClass("hover");
});

//Filter
$("#filterDropdown li a").click(function() {
  currentFilter = $(this).text();
  if (currentFilter === "File Name"){
    $("#filterDate").hide();
    $("#filterDate2").hide();
    $("#filterText").show();
    $("#filterTextInput").val("");
    $("#filterDateInput").val("");
    $("#filterInputLabel").text(currentFilter);
    $("#filterTextInput").attr("placeholder", "Original File Name");
  } else if (currentFilter === "Tag"){
    currentFilter = "Category";
    $("#filterDate").hide();
    $("#filterDate2").hide();
    $("#filterText").show();
    $("#filterTextInput").val("");
    $("#filterDateInput").val("");
    $("#filterInputLabel").text(currentFilter);
    $("#filterTextInput").attr("placeholder", "e.g. head, torso");
  } else if (currentFilter === "Uploaded Before" || currentFilter === "Uploaded After") {
    $("#filterText").hide();
    $("#filterDate2").hide();
    $("#filterDate").show();
    $("#filterTextInput").val("");
    $("#filterDateInput").val("");
    $("#filterInputLabel2").text(currentFilter);
  } else if (currentFilter === "Uploaded Between") {
    $("#filterText").hide();
    $("#filterDate").hide();
    $("#filterDate2").show();
    $("#filterDateInput2").val("");
    $("#filterTextInput").val("");
    $("#filterDateInput").val("");
    $("#filterInputLabel2").text(currentFilter);
  } else if (currentFilter === "File Type") {
    $("#filterDate").hide();
    $("#filterDate2").hide();
    $("#filterText").hide();
    $("#filterText").show();
    $("#filterTextInput").val("");
    $("#filterDateInput").val("");
    $("#filterInputLabel").text(currentFilter);
    $("#filterTextInput").attr("placeholder", "e.g. JPEG, DICOM_STUDY");
  }
});
$("#filterTextInput").keypress(function(event) {
  if (event.which == 13) {
    event.preventDefault();
    var userInput = $(this).val();
    filteredGalleryObjectList(currentFilter, userInput);
  }
});
$("#filterTextBtn").click(function(event) {
  event.preventDefault();
  var userInput = $("#filterTextInput").val();
  filteredGalleryObjectList(currentFilter, userInput);
});
$("#filterDateInput").keypress(function(event) {
  if (event.which == 13) {
    event.preventDefault();
    var userInput = $(this).val();
    filteredGalleryObjectList(currentFilter, userInput);
  }
});
$("#filterDateBtn").click(function(event) {
  event.preventDefault();
  var userInput = $("#filterDateInput").val();
  filteredGalleryObjectList(currentFilter, userInput);
});
$("#filterDateInput3").keypress(function(event) {
  if (event.which == 13) {
    event.preventDefault();
    var date1 = $("#filterDateInput2").val();
    var date2 = $("#filterDateInput3").val();
    filteredGalleryListDates(date1, date2);
  }
});
$("#filterDatesBtn").click(function(event) {
  event.preventDefault();
  var date1 = $("#filterDateInput2").val();
  var date2 = $("#filterDateInput3").val();
  filteredGalleryListDates(date1, date2);
});
$(".remove-filter").click(function(event) {
  event.preventDefault();
  $("#userDocs").empty();
  $("#filterText").hide();
  $("#filterDate").hide();
  $("#filterDate2").hide();
  getGalleryObjectList(function(done, data) {
    if (done && data) {
      layoutData(data);
    }
  });
});
