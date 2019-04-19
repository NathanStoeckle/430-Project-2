const handlePassChange = (e) => {
  e.preventDefault();
  
  $("#errorContainer").animate({width:'hide'},350);
  
  if($("#oldPass").val() == '' || $("#newPass").val() == ''|| $("#newPass2").val() == ''){
    handleError("All fields are required!!");
    return false;
  }
  
  sendAjax('POST', $("#passwordForm").attr("action"), $("#passwordForm").serialize(), redirect);
  
  return false;
};

const handleAd = (e) =>{
  e.preventDefault();
  return false;
}

const PasswordForm= (props) =>{
	//renders form
  return (
  	<form id="passwordForm" name="passwordForm" onSubmit={handlePassChange} action="/changePassword" method="POST" className="passwordForm">
        <div id="changeForm">
        <h3 id="change">Change Password:</h3>
        <input id="oldPass" type="password" name="oldPass" placeholder="Old Password"/><br/><br/>
        <input id="newPass" type="password" name="newPass" placeholder="New Password"/><br/><br/>
        <input id="newPass2" type="password" name="newPass2" placeholder="Re-type Password"/><br/><br/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="changePassword" type="submit" value="Update" />
      </div>
    </form>
  );
};

const payForm= (props) =>{
	//renders form
  return (
    <form id="adForm" name="adForm" onSubmit={handleAd} action="/ad" method="POST" className="adForm">
      <input type="hidden" name="_csrf" value={props.csrf}/>
      <input className="adSubmit" type="submit" value="$5" />
    </form>
  );
};

const setupAccountPage= function(csrf){
    
  const password = document.querySelector("#passwordContainer");
  const ad = document.querySelector("#adContainer");

  if(password){	
    //renders form
    ReactDOM.render(
      <PasswordForm csrf={csrf} />,document.querySelector("#updateForm")
    );
  } 
  
  if(ad){	
    //renders form
    ReactDOM.render(
      <DonateForm csrf={csrf} />,document.querySelector("#moneyForm")
    );
  } 
};

const getAccountToken = () =>{
  sendAjax('GET', '/getToken', null, (result)=>{
    setupAccountPage(result.csrfToken);
  });
};

$(document).ready(function(){
  getAccountToken();
});