const handleLogin = (e) => {
  e.preventDefault();

  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#user").val() == '' || $("#pass").val() == '') {
    handleError("RAWR! Username or password is empty");
    return false;
  }

  console.log($("input[name=_csrf]").val());

  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

  return false;
};

const handleSignup = (e) => {
  e.preventDefault();

  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("RAWR! Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

  return false;
};

const LoginWindow = (props) => {
  return ( 
    <form id = "loginForm"
      name = "loginForm"
      onSubmit = { handleLogin }
      action = "/login"
      method = 'POST'
      className = "mainForm">
      <h3 id="intro">Login to your account: </h3>
    <input id = "user" style={{fontSize: 14 + "pt"}} type = "text" name = "username" placeholder = "username" />
    <input id = "pass" style={{fontSize: 14 + "pt"}} type = "password" name = "pass" placeholder = "Password" />
    <input type = "hidden" name = "_csrf" value = { props.csrf }/>
    <input className = "formSubmit" type = "submit" value = "Sign in" />
    </form>
  );
};

const SignupWindow = (props) => {
  return ( 
    <form id = "signupForm"
      name = "signupForm"
      onSubmit = {handleSignup}
      action = "/signup"
      method = 'POST'
      className = "mainForm">
      <h3 id="intro">Create a new account: </h3>
      <input id = "user" style={{fontSize: 14 + "pt"}} type = "text" name = "username" placeholder = "Username" />
      <input id = "pass" style={{fontSize: 14 + "pt"}} type = "password" name = "pass" placeholder = "Password" />
      <input id = "pass2" style={{fontSize: 14 + "pt"}} type = "password" name = "pass2" placeholder = "Retype Password" />
      <input type = "hidden" name = "_csrf" value = { props.csrf }/> 
      <input className = "formSubmit" type = "submit" value = "Sign Up" />
    </form>
  );
};

const createLoginWindow = (csrf) => {
  ReactDOM.render( <
    LoginWindow csrf = {
      csrf
    }
    />,
    document.querySelector("#content"),
  );
};

const createSignupWindow = (csrf) => {
  ReactDOM.render( <
    SignupWindow csrf = {
      csrf
    }
    />,
    document.querySelector("#content"),
  );
};

const setup = (csrf) => {
  const loginButton = document.querySelector("#loginButton");
  const signupButton = document.querySelector("#signupButton");

  signupButton.addEventListener("click", (e) => {
    e.preventDefault();
    createSignupWindow(csrf);
    
    //Switch between what is being show to the user
    loginButton.classList.remove("selected");
    loginButton.classList.add("unselected");
    signupButton.classList.remove("unselected");
    signupButton.classList.add("selected");
    
    return false;
  });

  loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });

  createLoginWindow(csrf); //default view
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
