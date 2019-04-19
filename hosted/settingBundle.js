"use strict";

var handlePassChange = function handlePassChange(e) {
  e.preventDefault();

  $("#errorContainer").animate({ width: 'hide' }, 350);

  if ($("#oldPass").val() == '' || $("#newPass").val() == '' || $("#newPass2").val() == '') {
    handleError("All fields are required!!");
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
    { id: "passwordForm", name: "passwordForm", onSubmit: handlePassChange, action: "/changePassword", method: "POST", className: "passwordForm" },
    React.createElement(
      "div",
      { id: "changeForm" },
      React.createElement(
        "h3",
        { id: "change" },
        "Change Password:"
      ),
      React.createElement("input", { id: "oldPass", type: "password", name: "oldPass", placeholder: "Old Password" }),
      React.createElement("br", null),
      React.createElement("br", null),
      React.createElement("input", { id: "newPass", type: "password", name: "newPass", placeholder: "New Password" }),
      React.createElement("br", null),
      React.createElement("br", null),
      React.createElement("input", { id: "newPass2", type: "password", name: "newPass2", placeholder: "Re-type Password" }),
      React.createElement("br", null),
      React.createElement("br", null),
      React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
      React.createElement("input", { className: "changePassword", type: "submit", value: "Update" })
    )
  );
};

var payForm = function payForm(props) {
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

  if (password) {
    //renders form
    ReactDOM.render(React.createElement(PasswordForm, { csrf: csrf }), document.querySelector("#updateForm"));
  }

  if (ad) {
    //renders form
    ReactDOM.render(React.createElement(DonateForm, { csrf: csrf }), document.querySelector("#moneyForm"));
  }
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
