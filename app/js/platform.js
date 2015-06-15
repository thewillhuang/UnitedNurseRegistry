 //On document ready
$(document).ready(function() {
  if (typeof $.cookie('sidebar_closed') === 'undefined') {
    $.cookie('sidebar_closed', '1');
  }
  Metronic.init(); // init metronic core components
  Layout.init(); // init current layout
  QuickSidebar.init(); // init quick sidebar
  Demo.init(); // init demo features
  setActiveTabColor();

  //Log out user button click event
  $("#logOutButton").click(function() {
    logOutUser();
  });

});

// Make page sidebar scroll with page
$(function() {
  var $sidebar = $("#pageSidebar"),
    $window = $(window),
    offset = $sidebar.offset(),
    topPadding = 45;

  $window.scroll(function() {
    if ($window.scrollTop() > offset.top) {
      $sidebar.stop().animate({
        marginTop: $window.scrollTop() - offset.top + topPadding
      });
    } else {
      $sidebar.stop().animate({
        marginTop: 0
      });
    }
  });
});

function setActiveTabColor(){
  var page = window.location.href;
  page = page.split('/').slice(-1).pop();
  var $pageLink = $('a[href$="'+page+'"]');
  $($pageLink).children().addClass("active-nav-tab");
}

function logOutUser() {
  var newuri = API_ROOT + 'api/users/logout';
  var payload;
  ajaxPost(newuri, payload, function(data, done, message) {
      sessionStorage.removeItem("tokenKey");
      sessionStorage.removeItem("activeProfile");
    if (done) {
      window.location.replace(GLOBAL_WEB_ROOT + "index.html");
    } else {
      window.location.replace(GLOBAL_WEB_ROOT + "index.html");
      return false;
    }
  });
}

//Reusable axax function
function ajaxPost(newuri, payload, callback) {
  var token = sessionStorage.getItem("tokenKey");
  var headers = {};
  if (token) {
    headers.Authorization = 'Bearer ' + token;
  }
  $.ajax({
    type: "POST",
    url: newuri,
    headers: headers,
    data: JSON.stringify(payload),
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    success: function(data, status, error) {
      // console.log(data);
      // sessionStorage.setItem("tokenKey", data.access_token);
      if (data.error) {
        callback(data, false, status);
      } else {
        callback(data, true, status);
      }
    },
    error: function(data, status, error) {
      if (data.status === "403" || data.status === 403) {
        console.log(data.status);
        sessionStorage.clear();
        sessionStorage.setItem('tokenKey', "invalid");
        sessionStorage.setItem("activeProfile", "invalid");
        sweetAlert("Your session has expired");
        window.location.replace(GLOBAL_WEB_ROOT);
      } else if (data.status === "500" || data.status === 500) {
        console.log(data.responseText);
      }
      // sessionStorage.setItem("tokenKey", data.access_token);
      callback(data, false, error);
    }
  });
}
