$(document).ready(function() {
  $(".inp-val-3").hide();
  $(".inp-val-4").hide();
  $(".inp-val-6").hide();
  $(".inp-val-weight").hide();
  VMasker($("#phone")).maskPattern("999-999-9999");
  VMasker($("#height")).maskPattern("99'99''");
  VMasker($("#weight")).maskPattern("99999");
  VMasker($("#state")).maskPattern("AA");
});

function validateRequired(callback) {
  var firstName = $("#firstName");
  var lastName = $("#lastName");
  var sex;
  if ($('#maleRadio').is(':checked') || $('#femaleRadio').is(':checked')) {
    sex = "checked";
  }
  validateFirstName(function(done) {
    if (done) {
      validateLastName(function(done) {
        if (done) {
          if (firstName.hasClass("green-ok") && lastName.hasClass("green-ok") && (sex === "checked")) {
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
  $(".firstName-check").show();
  validateFirstName(function(done) {
    console.log(done);
  });
});

function validateFirstName(callback) {
  var name = $("#firstName").val();
  if (name == "") {
    $("#firstName").removeClass("green-ok").addClass("red-error");
    $(".firstName-check i").removeClass("inp-ok").removeClass("fa-check").addClass("inp-error").addClass("fa-remove");
    $("#firstName").attr("placeholder", "Required field");
  } else if (name.length > 25) {
    $("#firstName").removeClass("green-ok").addClass("red-error");
    $(".firstName-check i").removeClass("inp-ok").removeClass("fa-check").addClass("inp-error").addClass("fa-remove");
    $("#firstName").val('').attr("placeholder", "Name too long");
  } else {
    $("#firstName").removeClass("red-error").addClass("green-ok");
    $(".firstName-check i").removeClass("inp-error").removeClass("fa-remove").addClass("inp-ok").addClass("fa-check");
  }
  callback(true);
}
$("#middleName").blur(function() {
  $(".middleName-check").show();
  var name = $(this).val();
  if (name.length > 25) {
    $(this).removeClass("green-ok").addClass("red-error");
    $(".middleName-check i").removeClass("inp-ok").removeClass("fa-check").addClass("inp-error").addClass("fa-remove");
    $(this).val('').attr("placeholder", "Name too long");
  } else {
    $(this).removeClass("red-error").addClass("green-ok");
    $(".middleName-check i").removeClass("inp-error").removeClass("fa-remove").addClass("inp-ok").addClass("fa-check");
  }
});
$("#lastName").blur(function() {
  $(".lastName-check").show();
  validateLastName(function(done) {
    console.log(done);
  });
});
$("#height").blur(function() {
  $(".height-check").show();
  var length = $(this).val().length;
  if (length > 50) {
    $(this).removeClass("green-ok").addClass("red-error");
    $(".height-check i").removeClass("inp-ok").removeClass("fa-check").addClass("inp-error").addClass("fa-remove");
    $(this).val('').attr("placeholder", "25 character limit");
  } else {
    $(this).removeClass("red-error").addClass("green-ok");
    $(".height-check i").removeClass("inp-error").removeClass("fa-remove").addClass("inp-ok").addClass("fa-check");
  }
});
$("#weight").blur(function() {
  $(".weight-check").show();
  var length = $(this).val().length;
  if (length > 25) {
    $(this).removeClass("green-ok").addClass("red-error");
    $(".weight-check i").removeClass("inp-ok").removeClass("fa-check").addClass("inp-error").addClass("fa-remove");
    $(this).val('').attr("placeholder", "25 character limit");
  } else {
    $(this).removeClass("red-error").addClass("green-ok");
    $(".weight-check i").removeClass("inp-error").removeClass("fa-remove").addClass("inp-ok").addClass("fa-check");
  }
});
$("#dob").blur(function() {
  $(".dob-check").show();
  var length = $(this).val().length;
  if (length > 1) {
    $(this).removeClass("red-error").addClass("green-ok");
    $(".dob-check i").removeClass("inp-error").removeClass("fa-remove").addClass("inp-ok").addClass("fa-check");
  } else {
    if (dob !== "") {
      $(this).removeClass("green-ok").addClass("red-error");
      $(".dob-check i").removeClass("inp-ok").removeClass("fa-check").addClass("inp-error").addClass("fa-remove");
      $(this).val('').attr("placeholder", "MM/DD/YYYY");
    }
  }
});

function validateLastName(callback) {
  $(".lastName-check").show();
  console.log("validating last name");
  var name = $("#lastName").val();
  if (name == "") {
    $("#lastName").removeClass("green-ok").addClass("red-error");
    $(".lastName-check i").removeClass("inp-ok").removeClass("fa-check").addClass("inp-error").addClass("fa-remove");
    $("#lastName").attr("placeholder", "Required field");
  } else if (name.length > 25) {
    $("#lastName").removeClass("green-ok").addClass("red-error");
    $(".lastName-check i").removeClass("inp-ok").removeClass("fa-check").addClass("inp-error").addClass("fa-remove");
    $("#lastName").val('').attr("placeholder", "Name too long");
  } else {
    $("#lastName").removeClass("red-error").addClass("green-ok");
    $(".lastName-check i").removeClass("inp-error").removeClass("fa-remove").addClass("inp-ok").addClass("fa-check");
  }
  callback(true);
}
$("#address").blur(function() {
  $(".address-check").show();
  var length = $(this).val().length;
  if (length > 50) {
    $(this).removeClass("green-ok").addClass("red-error");
    $(".address-check i").removeClass("inp-ok").removeClass("fa-check").addClass("inp-error").addClass("fa-remove");
    $(this).val('').attr("placeholder", "Address too long");
  } else {
    $(this).removeClass("red-error").addClass("green-ok");
    $(".address-check i").removeClass("inp-error").removeClass("fa-remove").addClass("inp-ok").addClass("fa-check");
  }
});
$("#address2").blur(function() {
  $(".address2-check").show();
  var length = $(this).val().length;
  if (length > 50) {
    $(this).removeClass("green-ok").addClass("red-error");
    $(".address2-check i").removeClass("inp-ok").removeClass("fa-check").addClass("inp-error").addClass("fa-remove");
    $(this).val('').attr("placeholder", "Address too long");
  } else {
    $(this).removeClass("red-error").addClass("green-ok");
    $(".address2-check i").removeClass("inp-error").removeClass("fa-remove").addClass("inp-ok").addClass("fa-check");
  }
});
$("#city").blur(function() {
  $(".city-check").show();
  var length = $(this).val().length;
  if (length > 25) {
    $(this).removeClass("green-ok").addClass("red-error");
    $(".city-check i").removeClass("inp-ok").removeClass("fa-check").addClass("inp-error").addClass("fa-remove");
    $(this).val('').attr("placeholder", "City too long");
  } else {
    $(this).removeClass("red-error").addClass("green-ok");
    $(".city-check i").removeClass("inp-error").removeClass("fa-remove").addClass("inp-ok").addClass("fa-check");
  }
});
$("#state").blur(function() {
  $(".state-check").show();
  var length = $(this).val().length;
  if (length !== 2) {
    $(this).removeClass("green-ok").addClass("red-error");
    $(".state-check i").removeClass("inp-ok").removeClass("fa-check").addClass("inp-error").addClass("fa-remove");
    $(this).val('').attr("placeholder", "EX. CA");
  } else {
    $(this).removeClass("red-error").addClass("green-ok");
    $(".state-check i").removeClass("inp-error").removeClass("fa-remove").addClass("inp-ok").addClass("fa-check");
  }
});
$("#zip").blur(function() {
  $(".zip-check").show();
  var length = $(this).val().length;
  if (length !== 5) {
    $(this).removeClass("green-ok").addClass("red-error");
    $(".zip-check i").removeClass("inp-ok").removeClass("fa-check").addClass("inp-error").addClass("fa-remove");
    $(this).val('').attr("placeholder", "5 digit zip code");
  } else {
    $(this).removeClass("red-error").addClass("green-ok");
    $(".zip-check i").removeClass("inp-error").removeClass("fa-remove").addClass("inp-ok").addClass("fa-check");
  }
});
$("#phone").blur(function() {
  $(".phone-check").show();
  var phone = $(this).val();
  if (phone !== "") {
    $(this).removeClass("red-error").addClass("green-ok");
    $(".phone-check i").removeClass("inp-error").removeClass("fa-remove").addClass("inp-ok").addClass("fa-check");
  } else {
    $(this).removeClass("green-ok").addClass("red-error");
    $(".phone-check i").removeClass("inp-ok").removeClass("fa-check").addClass("inp-error").addClass("fa-remove");
    $(this).val('').attr("placeholder", "Please enter a phone #");
  }
});
$("#altEmail").blur(function() {
  $(".email-check").show();
  var email = $(this).val();
  var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
  if (filter.test(email)) {
    $(this).removeClass("red-error").addClass("green-ok");
    $(".email-check i").removeClass("inp-error").removeClass("fa-remove").addClass("inp-ok").addClass("fa-check");
  } else {
    $(this).removeClass("green-ok").addClass("red-error");
    $(".email-check i").removeClass("inp-ok").removeClass("fa-check").addClass("inp-error").addClass("fa-remove");
    $(this).val('').attr("placeholder", "Please enter an email");
  }
});
