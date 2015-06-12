 //On document ready
$(document).ready(function() {
  console.log($.cookie('sidebar_closed'));
  if (typeof $.cookie('sidebar_closed') === 'undefined') {
    $.cookie('sidebar_closed', '1');
  }
  Metronic.init(); // init metronic core components
  Layout.init(); // init current layout
  QuickSidebar.init(); // init quick sidebar
  Demo.init(); // init demo features

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

//Enable back navigation
function setNavigation(currentPath) {
  if (currentPath != '') {
    var path = currentPath;
    path = path.replace(/\/$/, '');
    path = decodeURIComponent(path);
    $('ul.sub-menu a').each(function() {
      var href = $(this).attr('href');
      if (href.indexOf('http') == 0) {
        if (path.substring(0, href.length) === href) {
          $(this).closest('li').closest('ul').show();
          $(this).closest('li').addClass('selected');
          $(this).css('color', 'red');
          return false;
        }
      }
    });
  }
}

function logOutUser() {
  var newuri = API_ROOT + 'api/users/logout';
  var payload;
  ajaxPost(newuri, payload, function(data, done, message) {
    if (done) {
      sessionStorage.removeItem("tokenKey");
      window.location.replace(GLOBAL_WEB_ROOT + "index.html");
    } else {
      return false;
    }
  });
  window.location.replace(GLOBAL_WEB_ROOT + "index.html");
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
