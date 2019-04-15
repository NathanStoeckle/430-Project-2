"use strict";

var handleUpdate = function handleUpdate(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#username").val() == '' || $("#pass").val() == '') {
        handleError("All fields are required!");
        return false;
    }

    sendAjax('POST', $("#updateForm").attr("action"), $("#updateForm").serialize(), redirect);
    return false;
};
var passwordUpdateWindow = function passwordUpdateWindow(props) {
    return React.createElement(
        "form",
        { id: "updateForm",
            name: "updateForm",
            onSubmit: handleUpdate,
            action: "/setting",
            method: "POST",
            className: "updateForm"
        },
        React.createElement(
            "h3",
            null,
            "Change Password"
        ),
        React.createElement(
            "label",
            { htmlFor: "username" },
            "Username: "
        ),
        React.createElement("input", { id: "username", type: "text", name: "username", placeholder: "Username" }),
        React.createElement("br", null),
        React.createElement(
            "label",
            { htmlFor: "pass" },
            "New Password: "
        ),
        React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "New Password" }),
        React.createElement("br", null),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("br", null),
        React.createElement("input", { className: "passwordUpdateSubmit", type: "submit", value: "Update password" }),
        React.createElement("hr", null)
    );
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement("passwordUpdateWindow", { csrf: csrf }), document.querySelector("#updateForm"));
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
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
