// Show single board view click event
$(document).on('click', '.single-board-view', function() {
  var boardGuid = $(this).closest(".user-board").find("div.board-items").attr("id");
  showSingleBoardView(boardGuid);
});
// Note dropdown event
$(document).on('click', '#noteDropdownList li a', function(event) {
  event.preventDefault();
  category = $(this).text();
  getCategory(category);
});
// Note modal
$(document).on('click', '.add-board-note', function(event) {
  event.preventDefault();
  currentNoteType = 'Board';
  $("#noteImage").empty();
  var boardGuid = $(this).closest("div.single-board").attr("id");
  currentNoteObject = boardGuid;
  // Get any previous notes for the item
  $("#previousNotes").empty();
  getObjectNotes(boardGuid, 'Board');
  currentNoteType = "Board";
  $('#noteModal').modal('show');
  $('#addNotesRow').hide();
});
// Delete a note
$(document).on('click', '.delete-this-note', function() {
  var noteGuid = $(this).attr("id");
  deleteNote(noteGuid, currentNoteType);
});
// Delete board click
$(document).on('click', '.delete-board', function(event) {
  event.preventDefault();
  var boardGuid = $(this).closest("div.single-board").attr("id");
  swal({   title: "Are you sure you want to delete this board?",   text: "You will not be able to recover this board!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){
    deleteBoard(boardGuid);
  });
});
// Delete item from a board
$(document).on('click', '#deleteFromBoardBtn', function() {
  deleteFromBoard(currentBoardObject, currentBoardGuid);
});
// Delete board label from list
$(document).on('click', '.delete-board-label', function() {
  $(this).parent("span").remove();
});
// $(document).on('click', '.make-board-glimpse', function(){
//   console.log("clicked");
//   var boardGuid = $(this).closest("div.single-board").attr("id");
//   console.log(boardGuid);
//   $("#boardGlimpseModal").modal('show');
// });
$(document).on('click', '#boardBack', function() {
  $("#myBoardsTitle").text("MY BOARDS");
  location.reload();
});

// Note modal
$(document).on('click', '.add-note', function(event) {
  event.preventDefault();
  $("#noteImage").empty();
  if ($("#addNotesTab").hasClass("active-note-link")){
    $("#addNotesTab").toggleClass("active-note-link");
    $("#viewNotesTab").toggleClass("active-note-link");
  }
  var noteImage = $(this).closest("div.item-controls").attr("id");
  var imageGuid = $(this).closest("div.user-board-item").attr("id");
  currentNoteObject = imageGuid;
  currentNoteType = "GalleryObject";
  $(".note-container").attr("id", imageGuid);
  // Get any previous notes for the item
  $("#previousNotes").empty();
  getObjectNotes(imageGuid, 'GalleryObject');
  $('#noteModal').modal('show');
  $('#addNotesRow').hide();
});
$(document).on('click', '.single-add-note', function(event) {
  event.preventDefault();
  currentNoteType = 'GalleryObject';
  $("#noteImage").empty();
  if ($("#addNotesTab").hasClass("active-note-link")){
    $("#addNotesTab").toggleClass("active-note-link");
    $("#viewNotesTab").toggleClass("active-note-link");
  }
  var noteImage = $(this).closest("div.item-controls").attr("id");
  var imageGuid = $(this).closest("div.single-board-item").attr("id");
  currentNoteObject = imageGuid;
  currentNoteType = "GalleryObject";
  $(".note-container").attr("id", imageGuid);
  // Get any previous notes for the item
  $("#previousNotes").empty();
  getObjectNotes(imageGuid, 'GalleryObject');
  $('#noteModal').modal('show');
  $('#addNotesRow').hide();
});
// Edit a board main info
$(document).on('click', '.edit-board', function(event) {
  event.preventDefault();
  $("#previousCategories").empty();
  var boardName = $(".single-board-title").html();
  var boardDescription = $(".single-board-description").html();
  var categories = $(this).attr("id");
  console.log(categories);
  categories = categories.split(',');
  for (var i in categories) {
    console.log(categories[i]);
    var html = "<span class='label label-primary'>" + categories[i] + "<i class='fa fa-remove delete-board-label'></i></span";
    $("#previousCategories").append(html);
  }
  $("#editBoardName").val(boardName);
  $("#editBoardDescription").val(boardDescription);
  $("#editBoardCateogires").val(categories);
  $("#editBoardModal").modal("show");
});
$("#editBoardBtn").click(function() {
  var guid = $(".single-board").attr("id");
  console.log(guid);
  var name = $("#editBoardName").val();
  var description = $("#editBoardDescription").val();
  var categoryList = $("#editBoardCategories").val();
  console.log(categoryList);
  if (categoryList) {
    categoryList += ',';
  }
  $("#previousCategories span").each(function() {
    console.log(this);
    categoryList += $(this).text() + ',';
  });
  console.log(categoryList);
  updateBoard(guid, name, description, categoryList);
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
  var objectType = 'galleryobject';
  deleteNote(noteGuid, objectType);
});
// Edit a note click
$(document).on('click', '.edit-this-note', function(event) {
  event.preventDefault();
  if (currentNoteType === "Board"){
    var objectGuid = currentBoardGuid;
    var noteGuid = $(this).next().attr("id");
    console.log(objectGuid, noteGuid);
    displayEditNote(objectGuid, noteGuid, 'Board');
  } else if (currentNoteType === "GalleryObject"){
    var objectGuid = $(".note-container").attr("id");
    var noteGuid = $(this).next().attr("id");
    console.log(objectGuid, noteGuid);
    displayEditNote(objectGuid, noteGuid, 'GalleryObject');
  }
});
$(document).on('click', '#editNoteSubmit', function() {
  var noteGuid = $(".edit-note").attr("id");
  var imageGuid = currentBoardGuid;
  updateNote(noteGuid, 'Board', function(done) {
    if (done) {
      $("#previousNotes").empty();
      getObjectNotes(imageGuid, 'Board');
    }
  })
});
// Delete gallery object
$(document).on('click', '.delete-file', function() {
  var boardGuid = $(this).closest(".board-items").attr("id");
  var objectGuid = $(this).closest(".user-board-item").attr("id");
  deleteFromBoard(objectGuid, boardGuid);
});
$(document).on('click', '.single-delete-file', function() {
  var boardGuid = $(this).closest("div.single-board").attr("id");
  var objectGuid = $(this).closest(".single-board-item").attr("id");
  deleteFromBoard(objectGuid, boardGuid);
});
// Handle Download
$(document).on('click', '.download-item', function(event) {
  event.preventDefault();
  var objectGuid = $(this).closest("div.user-board-item").attr("id");
  downloadGalleryObject(objectGuid);
});
$(document).on('click', '.single-download-item', function(event) {
  event.preventDefault();
  var objectGuid = $(this).closest("div.single-board-item").attr("id");
  downloadGalleryObject(objectGuid);
});
//Filter
$("#filterDropdown li a").click(function(){
  currentFilter = $(this).text();
  if (currentFilter === "File Name" || currentFilter === "Category"){
    $("#filterDate").hide();
    $("#filterDate2").hide();
    $("#filterText").show();
    $("#filterTextInput").val("");
    $("#filterDateInput").val("");
    $("#filterInputLabel").text(currentFilter);
    $("#filterTextInput").attr("placeholder", "Filter keyword");
  } else if (currentFilter === "Uploaded Before" || currentFilter === "Uploaded After"){
    $("#filterText").hide();
    $("#filterDate2").hide();
    $("#filterDate").show();
    $("#filterTextInput").val("");
    $("#filterDateInput").val("");
    $("#filterInputLabel2").text(currentFilter);
  } else if (currentFilter === "Uploaded Between"){
    $("#filterText").hide();
    $("#filterDate").hide();
    $("#filterDate2").show();
    $("#filterDateInput2").val("");
    $("#filterTextInput").val("");
    $("#filterDateInput").val("");
    $("#filterInputLabel2").text(currentFilter);
  } else if (currentFilter === "File Type"){
    $("#filterDate").hide();
    $("#filterDate2").hide();
    $("#filterText").hide();
    $("#filterText").show();
    $("#filterTextInput").val("");
    $("#filterDateInput").val("");
    $("#filterInputLabel").text(currentFilter);
    $("#filterTextInput").attr("placeholder", "e.g. JPEG, DICOM_STUDY");
  }
  console.log(currentFilter);
});
$("#filterTextInput").keypress(function(event){
  if ( event.which == 13 ) {
     event.preventDefault();
     var userInput = $(this).val();
     filteredGalleryObjectList(currentBoardGuid, currentFilter, userInput);
  }
});
$("#filterTextBtn").click(function(event){
  event.preventDefault();
  var userInput = $("#filterTextInput").val();
  console.log(userInput);
  filteredGalleryObjectList(currentBoardGuid, currentFilter, userInput);
});
$("#filterDateInput").keypress(function(event){
  if ( event.which == 13 ) {
     event.preventDefault();
     var userInput = $(this).val();
     console.log(userInput);
     filteredGalleryObjectList(currentBoardGuid, currentFilter, userInput);
  }
});
$("#filterDateBtn").click(function(event){
  event.preventDefault();
  var userInput = $("#filterDateInput").val();
  console.log(userInput);
  filteredGalleryObjectList(currentBoardGuid, currentFilter, userInput);
});
$("#filterDateInput3").keypress(function(event){
  if ( event.which == 13 ) {
    event.preventDefault();
    var date1 = $("#filterDateInput2").val();
    var date2 = $("#filterDateInput3").val();
    filteredGalleryListDates(currentBoardGuid, date1, date2);
  }
});
$("#filterDatesBtn").click(function(event){
  event.preventDefault();
  var date1 = $("#filterDateInput2").val();
  var date2 = $("#filterDateInput3").val();
  console.log(date1, date2);
  filteredGalleryListDates(currentBoardGuid, date1, date2);
});
$(".remove-filter").click(function(event){
  event.preventDefault();
  $("#userDocs").empty();
  $("#filterText").hide();
  $("#filterDate").hide();
  $("#filterDate2").hide();
  showSingleBoardView(currentBoardGuid);
});
//
// Handle viewer
$(document).on('dblclick', '.user-board-item-thumbnail', function() {
  var objectType = $(this).attr("id");
  if (objectType == "DICOM_STUDY") {
    var objectGuid = $(this).closest(".user-board-item").attr("id");
    dicomViewerLoadStudy(objectGuid, objectType);
  } else {
    var objectGuid = $(this).closest(".user-board-item").attr("id");
    imageViewerLoadStudy(objectGuid, objectType);
  }
});
// Handle viewer
$(document).on('dblclick', '.single-board-item-thumbnail', function() {
  var objectType = $(this).attr("id");
  objectType = objectType;
  if (objectType == "DICOM_STUDY") {
    var objectGuid = $(this).closest(".single-board-item").attr("id");
    dicomViewerLoadStudy(objectGuid, objectType);
  } else {
    var objectGuid = $(this).closest(".single-board-item").attr("id");
    imageViewerLoadStudy(objectGuid, objectType);
  }
});
