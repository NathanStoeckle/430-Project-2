const handleUpdate = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width: 'hide'}, 350);
    
    if ($("#username").val() == '' || $("#pass").val() == '') {
        handleError("All fields are required!");
        return false;
    }
  
    sendAjax('POST', $("#updateForm").attr("action"), $("#updateForm").serialize(), redirect);
    return false;
};
const passwordUpdateWindow = (props) => {
    return (
        <form id="updateForm"
          name="updateForm"
          onSubmit={handleUpdate}
          action="/setting" 
          method="POST" 
          className="updateForm"
          >
            <h3>Change Password</h3>
            <label htmlFor="username">Username: </label>
            <input id="username" type="text" name="username" placeholder="Username"/><br/>
            <label htmlFor="pass">New Password: </label>
            <input id="pass" type="password" name="pass" placeholder="New Password"/><br/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <br/>
            <input className="passwordUpdateSubmit" type="submit" value="Update password"/>
            <hr/>
        </form>
    );
};

const setup = (csrf) => {    
    ReactDOM.render(
        <passwordUpdateWindow csrf={csrf} />, 
        document.querySelector("#updateForm")
    );
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});