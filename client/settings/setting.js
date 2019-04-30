const handlePassChange = (e) => {
  e.preventDefault();
  
  $("#errorContainer").animate({width:'hide'},350);
  
  if($("#oldPass").val() == '' || $("#newPass").val() == ''|| $("#newPass2").val() == ''){
    handleError("All fields are required!");
    return false;
  }
  
  sendAjax('POST', $("#passwordForm").attr("action"), $("#passwordForm").serialize(), redirect);
  
  return false;
};

const handleAd = (e) => {
  e.preventDefault();
  return false;
}

const PasswordForm = (props) => {
  //renders form
  return (
  	<form id="passwordForm" 
      name="passwordForm" 
      onSubmit={handlePassChange} 
      action="/changePassword" 
      method="POST" 
      className="passwordForm">
        <div id="changeForm">
        <h3 id="change">Change Password:</h3>
        <input id="oldPass" type="password" name="oldPass" placeholder="Old Password"/>
        <input id="newPass" type="password" name="newPass" placeholder="New Password"/>
        <input id="newPass2" type="password" name="newPass2" placeholder="Re-type Password"/><br/><br/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="changePassword" type="submit" value="Update" />
          <div id="passwordInfo">
            <p>In order to change your password, enter in your old one, then enter in your new password, and click the update button.</p>
            <p><strong>PLEASE NOTE:</strong> Signout is automatic and <strong>WILL</strong> occur when the password is updated!</p>
        </div>
      </div>
    </form>
  );
};

const PayForm = (props) => {
	//renders form
  return (
    <form id="adForm" name="adForm" onSubmit={handleAd} action="/ad" method="POST" className="adForm">
      <input type="hidden" name="_csrf" value={props.csrf}/>
      <input className="adSubmit" type="submit" value="$5" />
    </form>
  );
};

const setupAccountPage = function(csrf){
    
  const password = document.querySelector("#passwordContainer");
  const ad = document.querySelector("#adContainer");
  const search = document.querySelector("#searchContainer");
  if(password){	
    //renders form
    ReactDOM.render(
      <PasswordForm csrf={csrf} />, document.querySelector("#updateForm")
    );
  } 
  
  if(ad){	
    //renders form
    ReactDOM.render(
      <PayForm csrf={csrf} />, document.querySelector("#moneyForm")
    );
  } 
  
  if(search) {
    //renders form
    ReactDOM.render(
      <SearchForm csrf={csrf} />, document.querySelector("#searchForm")
    );
    
    ReactDOM.render(
      <DomoList domos={[]} />, document.querySelector("#domos")
    );
    
    loadDomosFromServer();
  }
};

const handleSearch = (e) => {
  e.preventDefault();
  
  $("#errorContainer").animate({width:'hide'},350);
  
  if($("#keyTerm").val() == ''){
    handleError("Keyword is needed to search!");
    return false;
  }
  
  sendAjax('POST', $("#searchForm").attr("action"), $("#searchForm").serialize(), function(){
    loadDomosFromServer();
  });
  
  return false;
};

//Search functionality
const SearchForm = (props) => {
  //renders form
  return (
  	<form id="searchForm" 
      name="searchForm" 
      onSubmit={handleSearch} 
      action="/searchKeyword" 
      method="POST" 
      className="SearchForm">
      <div id="changeForm">
        <input id="keyTerm" type="text" name="keyTerm" placeholder="Title"/>
        <input className="searchKeyword" type="submit" value="Search" />
        <input type="hidden" name="_csrf" value={props.csrf}/>
      </div>
    </form>
  );
};

const DomoList = function(props) {
    if (props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">Notes have yet to be searched</h3>
            </div>
        );
    }
    
    const domoNodes = props.domos.map(function(domo) {
        console.dir(domo);
    });
    
    return(
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = () => {
  sendAjax('GET', '/getDomos', null, (data) => {
    ReactDOM.render(
      <DomoList domos={data.domos} />, document.querySelector("#domos")
    );
  });
};

const getAccountToken = () =>{
  sendAjax('GET', '/getToken', null, (result)=>{
    setupAccountPage(result.csrfToken);
  });
};

$(document).ready(function(){
  getAccountToken();
});