'use strict';

var grabUrl = function(url, lastIndexStartString, lastIndexEndString) {
  var path = url;
  var startParseIndex = path.lastIndexOf(lastIndexStartString) + lastIndexStartString.length;
  var endParseIndex = path.lastIndexOf(lastIndexEndString);
  if (endParseIndex === -1) {
    endParseIndex = path.length;
  }
  return path.slice(startParseIndex, endParseIndex);
};

var grabToken = function() {
  return grabUrl(window.location.href, '?l=');
};

function updateForgottenPassword() {
  var newuri = window.API_ROOT + 'api/users/updateforgottenPassword';
  var payload = {
    'lifeline': grabToken(),
    'newPassword': $('#updateForgottenPasswordNewPassword').val(),
    'confirmNewPassword': $('#updateForgottenPasswordConfirmNewPassword').val()
  };

  console.log(payload);

  $.ajax({
    type: 'POST',
    url: newuri,
    data: JSON.stringify(payload),
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    success: function() {
      // alert(data.Success);
      window.location.replace(window.GLOBAL_WEB_ROOT);
    },
    error: function() {
      // alert(data.Error);
    }
  });
}

$('#signup').click(function(event) {
  event.preventDefault();
  updateForgottenPassword();
});

$('#updateForgottenPasswordConfirmNewPassword').keypress(function(e) {
  if (e.which === 13) {
    updateForgottenPassword();
    return false;
  }
});

console.log(grabToken());
