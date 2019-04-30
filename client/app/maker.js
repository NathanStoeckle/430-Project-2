const handleDomo = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width:'hide'}, 350);
    
    if($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoLevel").val() == ''){
        handleError("All fields are required");
        return false;
    }
    
    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadDomosFromServer();
    });
    
    return false;
};

const DomoForm = (props) => {
    return(
        <form id="domoForm" name="domoForm"
              onSubmit={handleDomo}
              action="/maker"
              method="POST"
              className="domoForm"
            >
            <h3 id="change">Follow the steps below to create your idea: </h3>
            <input id="domoName" type="text" name="name" placeholder="Title of your post" /><br/><br/>
            <input id="domoAge" type="text" name="age" placeholder="Write your thoughts here" /><br/><br/>
            <input id="domoLevel" type="text" name="level" placeholder="What are the Key words here?" /><br/><br/>
            <input className="noteSubmit" type="submit" value="Create Note" />
            <input name="_csrf" type="hidden" value={props.csrf} />
        </form>
    );
};

const DomoList = function(props) {
    if (props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">Notes haven't been created yet</h3>
            </div>
        );
    }
    
    const domoNodes = props.domos.map(function(domo) {
        console.dir(domo);
        return (
            <div key={domo._id} className="domo">
                <h1 className="domoName">Title: {domo.name} </h1>
                <h2 className="domoAge">Idea: {domo.age} </h2>
                <div classname="heightFix">
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <h3 className="domoLevel">Key Words: {domo.level} </h3>
                </div>
            </div>
        );
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
            <DomoList domos={data.domos} />,
            document.querySelector("#domos")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );
    
    ReactDOM.render(
        <DomoList domos={[]} />, document.querySelector("#domos")
    );
    
    loadDomosFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});