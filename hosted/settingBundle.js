"use strict";

var handlePassChange = function handlePassChange(e) {
  e.preventDefault();

  $("#errorContainer").animate({ width: 'hide' }, 350);

  if ($("#oldPass").val() == '' || $("#newPass").val() == '' || $("#newPass2").val() == '') {
    handleError("All fields are required!");
    return false;
  }

  sendAjax('POST', $("#passwordForm").attr("action"), $("#passwordForm").serialize(), redirect);

  return false;
};

var handleAd = function handleAd(e) {
  e.preventDefault();
  return false;
};

var PasswordForm = function PasswordForm(props) {
  //renders form
  return React.createElement(
    "form",
    { id: "passwordForm",
      name: "passwordForm",
      onSubmit: handlePassChange,
      action: "/changePassword",
      method: "POST",
      className: "passwordForm" },
    React.createElement(
      "div",
      { id: "changeForm" },
      React.createElement(
        "h3",
        { id: "change" },
        "Change Password:"
      ),
      React.createElement("input", { id: "oldPass", type: "password", name: "oldPass", placeholder: "Old Password" }),
      React.createElement("input", { id: "newPass", type: "password", name: "newPass", placeholder: "New Password" }),
      React.createElement("input", { id: "newPass2", type: "password", name: "newPass2", placeholder: "Re-type Password" }),
      React.createElement("br", null),
      React.createElement("br", null),
      React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
      React.createElement("input", { className: "changePassword", type: "submit", value: "Update" }),
      React.createElement(
        "div",
        { id: "passwordInfo" },
        React.createElement(
          "p",
          null,
          "In order to change your password, enter in your old one, then enter in your new password, and click the update button."
        ),
        React.createElement(
          "p",
          null,
          React.createElement(
            "strong",
            null,
            "PLEASE NOTE:"
          ),
          " Signout is automatic and ",
          React.createElement(
            "strong",
            null,
            "WILL"
          ),
          " occur when the password is updated!"
        )
      )
    )
  );
};

var PayForm = function PayForm(props) {
  //renders form
  return React.createElement(
    "form",
    { id: "adForm", name: "adForm", onSubmit: handleAd, action: "/ad", method: "POST", className: "adForm" },
    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("input", { className: "adSubmit", type: "submit", value: "$5" })
  );
};

var setupAccountPage = function setupAccountPage(csrf) {

  var password = document.querySelector("#passwordContainer");
  var ad = document.querySelector("#adContainer");
  var search = document.querySelector("#searchContainer");
  if (password) {
    //renders form
    ReactDOM.render(React.createElement(PasswordForm, { csrf: csrf }), document.querySelector("#updateForm"));
  }

  if (ad) {
    //renders form
    ReactDOM.render(React.createElement(PayForm, { csrf: csrf }), document.querySelector("#moneyForm"));
  }

  if (search) {
    //renders form
    ReactDOM.render(React.createElement(SearchForm, { csrf: csrf }), document.querySelector("#searchForm"));

    ReactDOM.render(React.createElement(DomoList, { domos: [] }), document.querySelector("#domos"));

    loadDomosFromServer();
  }
};

var handleSearch = function handleSearch(e) {
  e.preventDefault();

  $("#errorContainer").animate({ width: 'hide' }, 350);

  if ($("#keyTerm").val() == '') {
    handleError("Keyword is needed to search!");
    return false;
  }

  sendAjax('POST', $("#searchForm").attr("action"), $("#searchForm").serialize(), function () {
    loadDomosFromServer();
  });

  return false;
};

//Search functionality
var SearchForm = function SearchForm(props) {
  //renders form
  return React.createElement(
    "form",
    { id: "searchForm",
      name: "searchForm",
      onSubmit: handleSearch,
      action: "/searchKeyword",
      method: "POST",
      className: "SearchForm" },
    React.createElement(
      "div",
      { id: "changeForm" },
      React.createElement("input", { id: "keyTerm", type: "text", name: "keyTerm", placeholder: "Title" }),
      React.createElement("input", { className: "searchKeyword", type: "submit", value: "Search" }),
      React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf })
    )
  );
};

var DomoList = function DomoList(props) {
  if (props.domos.length === 0) {
    return React.createElement(
      "div",
      { className: "domoList" },
      React.createElement(
        "h3",
        { className: "emptyDomo" },
        "Notes have yet to be searched"
      )
    );
  }

  var domoNodes = props.domos.map(function (domo) {
    console.dir(domo);
  });

  return React.createElement(
    "div",
    { className: "domoList" },
    domoNodes
  );
};

var loadDomosFromServer = function loadDomosFromServer() {
  sendAjax('GET', '/getDomos', null, function (data) {
    ReactDOM.render(React.createElement(DomoList, { domos: data.domos }), document.querySelector("#domos"));
  });
};

var getAccountToken = function getAccountToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setupAccountPage(result.csrfToken);
  });
};

$(document).ready(function () {
  getAccountToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
