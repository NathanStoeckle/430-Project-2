"use strict";

var handleDomo = function handleDomo(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoLevel").val() == '') {
        handleError("All fields are required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
        loadDomosFromServer();
    });
    return false;
};

var DomoForm = function DomoForm(props) {
    return React.createElement(
        "form",
        { id: "domoForm", name: "domoForm",
            onSubmit: handleDomo,
            action: "/maker",
            method: "POST",
            className: "domoForm"
        },
        React.createElement(
            "label",
            { htmlFor: "name", id: "title" },
            "Title: "
        ),
        React.createElement("input", { id: "domoName", type: "text", name: "name", placeholder: "Title of your post" }),
        React.createElement(
            "label",
            { htmlFor: "age", id: "idea" },
            "Idea: "
        ),
        React.createElement("input", { id: "domoAge", type: "text", name: "age", placeholder: "Write your thoughts here" }),
        React.createElement(
            "label",
            { htmlFor: "level", id: "key" },
            "Key words: "
        ),
        React.createElement("input", { id: "domoLevel", type: "text", name: "level", placeholder: "What are the Key words here?" }),
        React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Create Note" }),
        React.createElement("input", { name: "_csrf", type: "hidden", value: props.csrf })
    );
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));
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
