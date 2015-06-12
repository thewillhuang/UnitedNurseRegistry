$(document).ready(function() {
  VMasker($("#phone")).maskPattern("999-999-9999");
});

function validateRequired(callback) {
  var firstName = $("#firstName");
  var lastName = $("#lastName");
  var sex;
  if ($('#maleRadio').is(':checked') || $('#femaleRadio').is(':checked')) {
    sex = "checked";
    console.log(sex);
  }
  validateFirstName(function(done) {
    if (done) {
      validateLastName(function(done) {
        if (done) {
          if (firstName.hasClass("green-ok") && lastName.hasClass("green-ok") && (sex === "checked")) {
            console.log("validated required fields ok");
            callback(true);
          } else {
            sweetAlert("Whoops!", "Please fill in all required fields!");
            callback(false);
          }
        }
      });
    }
  });
}

// Required field validation
$("#firstName").blur(function() {
  validateFirstName(function(done) {
    console.log(done);
  });
});

function validateFirstName(callback) {
  var name = $("#firstName").val();
  if (name == "") {
    $("#firstName").removeClass("green-ok").addClass("red-error");
    $("#firstName").attr("placeholder", "Required field");
  } else if (name.length > 25) {
    $("#firstName").removeClass("green-ok").addClass("red-error");
    $("#firstName").attr("placeholder", "Name too long");
  } else {
    $("#firstName").removeClass("red-error").addClass("green-ok");
  }
  callback(true);
}
$("#middleName").blur(function() {
  var name = $(this).val();
  if (name.length > 25) {
    $(this).removeClass("green-ok").addClass("red-error");
    $(this).attr("placeholder", "Name too long");
  } else {
    $(this).removeClass("red-error").addClass("green-ok");
  }
});
$("#lastName").blur(function() {
  validateLastName(function(done) {
    console.log(done);
  });
});
$("#height").blur(function() {
  var length = $(this).val().length;
  if (length > 50) {
    $(this).removeClass("green-ok").addClass("red-error");
    $(this).val('').attr("placeholder", "25 character limit");
  } else {
    $(this).removeClass("red-error").addClass("green-ok");
  }
});
$("#weight").blur(function() {
  var length = $(this).val().length;
  if (length > 25) {
    $(this).removeClass("green-ok").addClass("red-error");
    $(this).val('').attr("placeholder", "25 character limit");
  } else {
    $(this).removeClass("red-error").addClass("green-ok");
  }
});
$("#dob").blur(function() {
  var length = $(this).val().length;
  if (length > 1) {
    $(this).removeClass("red-error").addClass("green-ok");
  } else {
    if (dob !== "") {
      $(this).removeClass("green-ok").addClass("red-error");
      $(this).val('').attr("placeholder", "MM/DD/YYYY");
    }
  }
});

function validateLastName(callback) {
  console.log("validating last name");
  var name = $("#lastName").val();
  if (name == "") {
    $("#lastName").removeClass("green-ok").addClass("red-error");
    $("#lastName").attr("placeholder", "Required field");
  } else if (name.length > 25) {
    $("#lastName").removeClass("green-ok").addClass("red-error");
    $("#lastName").attr("placeholder", "Name too long");
  } else {
    $("#lastName").removeClass("red-error").addClass("green-ok");
  }
  callback(true);
}
$("#address").blur(function() {
  var length = $(this).val().length;
  if (length > 50) {
    $(this).removeClass("green-ok").addClass("red-error");
    $(this).val('').attr("placeholder", "Address too long");
  } else {
    $(this).removeClass("red-error").addClass("green-ok");
  }
});
$("#address2").blur(function() {
  var length = $(this).val().length;
  if (length > 50) {
    $(this).removeClass("green-ok").addClass("red-error");
    $(this).val('').attr("placeholder", "Address too long");
  } else {
    $(this).removeClass("red-error").addClass("green-ok");
  }
});
$("#city").blur(function() {
  var length = $(this).val().length;
  if (length > 25) {
    $(this).removeClass("green-ok").addClass("red-error");
    $(this).val('').attr("placeholder", "City too long");
  } else {
    $(this).removeClass("red-error").addClass("green-ok");
  }
});
$("#state").blur(function() {
  var length = $(this).val().length;
  if (length !== 2) {
    $(this).removeClass("green-ok").addClass("red-error");
    $(this).val('').attr("placeholder", "Please format - Ex. CA");
  } else {
    $(this).removeClass("red-error").addClass("green-ok");
  }
});
$("#zip").blur(function() {
  var length = $(this).val().length;
  if (length !== 5) {
    $(this).removeClass("green-ok").addClass("red-error");
    $(this).val('').attr("placeholder", "5 digit zip code");
  } else {
    $(this).removeClass("red-error").addClass("green-ok");
  }
});
$("#phone").blur(function() {
  var phone = $(this).val();
  if (phone !== "") {
    $(this).removeClass("red-error").addClass("green-ok");
  } else {
    $(this).removeClass("green-ok").addClass("red-error");
    $(this).val('').attr("placeholder", "Please enter a phone #");
  }
});
$("#altEmail").blur(function() {
  var email = $(this).val();
  var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
  if (filter.test(email)) {
    $(this).removeClass("red-error").addClass("green-ok");
  } else {
    if (email !== "") {
      $(this).removeClass("green-ok").addClass("red-error");
      $(this).val('').attr("placeholder", "Please enter an email");
    }
  }
});
