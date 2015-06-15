var noteHtml = "";

// Create a note
function createNote(objectGuid, objectType, category) {
  var newuri = API_ROOT + 'api/notes/createnote';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var jsonObj = {};
  //iterate thorugh the child objects
  $("#categoryForm :input").each(
    function() {
      var id = $(this).attr("id");
      if ($(this).attr("type") == "checkbox") {
        if (this.checked) {
          var val = "true";
        } else {
          var val = "false";
        }
      } else {
        var val = $(this).val();
      }
      jsonObj[id] = val;
    }
  );
  $("#categoryForm textarea").each(
    function() {
      var id = $(this).attr("id");
      var val = $(this).val();
      if (val !== "") {
        jsonObj[id] = val;
      }
    }
  );
  var noteData = JSON.stringify(jsonObj);
  var payload = {
    'profileGuid': profileGuid,
    'objectGuid': objectGuid,
    'category': category,
    'objectType': objectType,
    'noteData': noteData
  };
  console.log(payload);
  ajaxPost(newuri, payload, function(data, done, message) {
    console.log(data.Error);
    console.log(data);
    if (done) {
      $('#categoryForm').empty();
      $("#previousNotes").empty();
      getObjectNotes(objectGuid, objectType);
      $("#viewNotesTab").toggleClass("active-note-link");
      $("#addNotesTab").toggleClass("active-note-link");
      $("#addNotesRow").hide();
      $("#viewNotesRow").show();
    } else {
      alert(data.Error);
    }
  });
}
//Get notes for an object
function getObjectNotes(objectGuid, objectType) {
  var newuri = API_ROOT + 'api/notes/getobjectnotes';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
    'profileGuid': profileGuid,
    'objectGuid': objectGuid,
    'objectType': objectType
  };
  ajaxPost(newuri, payload, function(data, done, message) {
    console.log(data);
    if (done && data) {
      var noteGuids = $.parseJSON(data.noteList);
      $.each(noteGuids, function(index, value) {
        getNote(objectGuid, value, objectType);
      });
    } else {
      return false;
    }
  });
}
//Get each note info
function getNote(objectGuid, noteGuid, objectType) {
  var newuri = API_ROOT + 'api/notes/getnote';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
    'profileGuid': profileGuid,
    'objectGuid': objectGuid,
    'noteGuid': noteGuid,
    'objectType': objectType
  };
  ajaxPost(newuri, payload, function(data, done, message) {
    if (done && data) {
      console.log(data);
      var topDiv = $('#previousNotes');
      var sentFrom;
      var html = "";
      var createdDate = data.createdDate.split('^');
      var created = createdDate[5];
      created = moment(createdDate).format('dddd, MMMM Do, YYYY');
      var noteSender = data.createdByGuid.split('^');
      sentFrom = noteSender[5];
      var noteType = data.category.split('^');
      var type = noteType[5];
      html = '<div class="view-user-note"><h4 class="note-h4 pull-left">' + type + '</h4><a class="edit-this-note pull-right" style="margin-left: 15px;"><i class="fa fa-pencil fa-1x"></i></a><a id="' + noteGuid + '" class="delete-this-note pull-right"><i class="fa fa-trash fa-1x"></i></a><div class="note-area note-height">';
      $.each(data, function(index, value) {
        if (index != 'category' && index != 'guid' && index != 'objectGuid' && index != 'createdByGuid' && index != 'editedByGuid' && index != 'createdDate' && index != 'editedDate') {
          var properties = value.split('^');
          var DataType = properties[0];
          var MaxSize = properties[1];
          var Description = properties[2];
          var Label = properties[3];
          var Required = properties[4];
          var Value = properties[5];
          var Type = properties[6];
          if (Type == 'noteInfo' || Type == 'noteData') {
            html += '<div class="see-note-div"><label>' + Label + '</label><p id="' + index + '">' + Value + '</p></div>';
          }
        }
      });
      html += "</div>";
      getProfile(sentFrom, function(firstName, lastName, photo) {
        if (firstName) {
          if (photo) {
            html += '<img src="data:image/jpg;base64,' + photo + '" style="width: 40px; height: 40px; display: inline-block;" class="img img-circle"><p style="font-size: 1.2em; display: inline-block; margin-left: 10px;">' + firstName + ' ' + lastName + '</p><p class="expand-icon"><a class="expand-user-note pull-right" title="View More"><i class="fa fa-ellipsis-h" style="color: #EB374C;"></i></a></p></div><hr class="note-hr">';
            topDiv.append(html);
          } else {
            html += '<img src="../images/ProfilePlaceholder.png" style="width: 40px; height: 40px; display: inline-block;" class="img img-circle"><p style="font-size: 1.2em; display: inline-block; margin-left: 10px;">' + firstName + ' ' + lastName + '</p><p class="expand-icon"><a class="expand-user-note pull-right" title="View More"><i class="fa fa-ellipsis-h" style="color: #EB374C;"></i></a></p></div><hr class="note-hr">';
            topDiv.append(html);
          }
        }
        //Init tooltips
        $("a").tooltip();
      });
    }
  });
}

//Get category form
function getCategory(category) {
  var newuri = API_ROOT + 'api/category/getcategory';
  var payload = {
    'category': category
  };
  ajaxPost(newuri, payload, function(data, done, message) {
    console.log(data);
    if (done) {
      var topDiv = $('#categoryForm');
      $(function() {
        $('#categoryForm').slimScroll({
          height: '400px'
        });
      });
      var html = '';
      $.each(data, function(index, value) {
        var properties = value.split('^');
        var DataType = properties[0];
        var MaxSize = properties[1];
        var Description = properties[2];
        var Label = properties[3];
        if (index == 'notes') {
          html += '<textarea rows="4" id="' + index + '" title="' + Description + '" placeholder ="' + Label + '" ';
          if (MaxSize > 0) {
            html += 'maxlength="' + MaxSize + '" />';
          } else {
            html += '/>';
          }
        } else {
          if (DataType === "bool") {
            html += '<div class="note-div"><label class="checkbox-inline"><input type="checkbox" id="' + index + '" title="' + Description + '" class="pull-right" style="width: auto !important;">' + Label + '</label></div>';
          } else {
            html += '<div class="note-div"><label>' + Label + '</label><input class="form-control input-sm note-input" type="text" id="' + index + '" title="' + Description + '" /></div>';
          }
        }
      });
    } else {
      console.log("couldn't get category stuff");
    }
    topDiv.empty();
    topDiv.append(html);
  });
}
// Get a user profile with picture
function getProfile(profileGuid, callback) {
  var newuri = API_ROOT + 'api/profiles/getprofile';
  var payload = {
    'profileGuid': profileGuid,
    'includePhoto': 'true'
  };
  console.log(payload);
  ajaxPost(newuri, payload, function(data, done, message) {
    if (done) {
      console.log(data);
      callback(data.firstName, data.lastName, data.profilePhoto);
    } else {
      console.log("whooops");
    }
  });
}

function deleteNote(noteGuid, objectType) {
  var newuri = API_ROOT + 'api/notes/deletenote';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
    'profileGuid': profileGuid,
    'noteGuid': noteGuid,
    'objectType': objectType
  };
  console.log(payload);
  ajaxPost(newuri, payload, function(data, done, message) {
    console.log(data, done, message);
    if (done) {
      sweetAlert("Deleted Note");
      $("#noteModal").modal('hide');
    }
  });
}

function updateNote(noteGuid, objectType, callback) {
  var newuri = API_ROOT + 'api/notes/updatenote';
  var profileGuid = sessionStorage.getItem("activeProfile");
  //iterate thorugh the child objects
  var jsonObj = {};
  $(".edit-note input").each(
    function() {
      var id = $(this).attr("id");
      if ($(this).attr("type") == "checkbox") {
        if (this.checked) {
          var val = "true";
        } else {
          var val = "false";
        }
      } else {
        var val = $(this).val();
      }
      console.log(val);
      jsonObj[id] = val;
    }
  );
  $(".edit-note textarea").each(
    function() {
      var id = $(this).attr("id");
      var val = $(this).val();
      jsonObj[id] = val;
    }
  );
  var noteData = JSON.stringify(jsonObj);
  console.log(noteData);
  var payload = {
    'profileGuid': profileGuid,
    'noteGuid': noteGuid,
    'objectType': objectType,
    'noteData': noteData
  };
  console.log(payload);
  ajaxPost(newuri, payload, function(data, done, message) {
    console.log(data, done, message);
    if (done) {
      callback(true);
    }
  });
}

function getEditNote(objectGuid, noteGuid, objectType, callback) {
  var newuri = API_ROOT + 'api/notes/getnote';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
    'profileGuid': profileGuid,
    'objectGuid': objectGuid,
    'objectType': objectType,
    'noteGuid': noteGuid
  };
  console.log(payload);
  ajaxPost(newuri, payload, function(data, done, message) {
    console.log(data, done, message);
    var html = '';

    html += '<div class="edit-note" id="' + noteGuid + '">';
    var category = data.category.split('^');
    category = category[5];

    if (category === "Freeform") {
      var note = data.notes.split('^');
      var noteDesc = note[5];
      html += '<div class="edit-note" id="' + noteGuid + '"><textarea rows="4" cols="50" id="notes">' + noteDesc + '</textarea><br><button class="btn btn-primary" id="editNoteSubmit">Update</button><button class="btn btn-default" id="cancelEditBtn">Cancel</button>';
    } else {

      $.each(data, function(index, value) {
        console.log(index);
        if (index != 'category' && index != 'guid' && index != 'objectGuid' && index != 'createdByGuid' && index != 'editedByGuid' && index != 'createdDate' && index != 'editedDate') {
          var properties = value.split('^');
          var DataType = properties[0];
          var MaxSize = properties[1];
          var Description = properties[2];
          var Label = properties[3];
          var Required = properties[4];
          var Value = properties[5];
          var Type = properties[6];
          if (Value !== undefined) {
            if (Value === "true") {
              html += '<div class="note-div"><label class="checkbox-inline"><input type="checkbox" id="' + index + '" title="' + Description + '" value="' + Value + '" checked style="width: auto !important;">' + Label + '</label></div>';
            } else if (Value === "false") {
              html += '<div class="note-div"><label class="checkbox-inline"><input type="checkbox" id="' + index + '" title="' + Description + '" value="' + Value + '"" style="width: auto !important;">' + Label + '</label></div>';
            } else {
              html += '<div class="form group note-div"><label>' + Label + '</label><input type="text" id="' + index + '" title="' + Description + '" value="' + Value + '"></div>';
            }
          }
        }
      });
      html += '</div><button class="btn btn-primary" id="editNoteSubmit">Update</button><button class="btn btn-default" id="cancelEditBtn">Cancel</button>';
    }
    callback(true, html);
  });
}

function displayEditNote(objectGuid, noteGuid, type) {
  console.log(objectGuid);
  getEditNote(objectGuid, noteGuid, type, function(done, html) {
    if (done) {
      noteHtml = $("#previousNotes").html();
      $("#previousNotes").empty();
      $("#previousNotes").append(html);
    }
  });
}

$("#noteDropdownList li a").click(function(){
  var text = $(this).text();
  $("#noteDropdown:first-child").html(text + ' <i class="fa fa-chevron-down"></i>');
  $("#noteDropdown:first-child").val($(this).text());
});

$("#viewNotesTab").click(function(event) {
  event.preventDefault();
  $(this).toggleClass("active-note-link");
  $("#addNotesTab").toggleClass("active-note-link");
  $("#addNotesRow").hide();
  $("#viewNotesRow").show();
});

$("#addNotesTab").click(function(event) {
  event.preventDefault();
  $(this).toggleClass("active-note-link");
  $("#viewNotesTab").toggleClass("active-note-link");
  $("#viewNotesRow").hide();
  $("#addNotesRow").show();
});

$(document).on('click', "#cancelEditBtn", function() {
  $("#previousNotes").empty();
  $("#previousNotes").append(noteHtml);
});

$(document).on('click', '.expand-user-note', function() {
  var className = $(this).children("i").attr("class");
  if (className === "fa fa-ellipsis-h") {
    $(this).children("i").attr("class", "fa fa-ellipsis-v");
  } else {
    $(this).children("i").attr("class", "fa fa-ellipsis-h");
  }
  $(this).closest(".view-user-note").find(".note-area").toggleClass("expand-note").toggleClass("note-height");
});
