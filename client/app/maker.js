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
            <label htmlFor="name" id="title">Title: </label>
            <input id="domoName" type="text" name="name" placeholder="Title of your post" />
            <label htmlFor="age" id="idea">Idea: </label>
            <input id="domoAge" type="text" name="age" placeholder="Write your thoughts here" />
            <label htmlFor="level" id="key">Key words: </label>
            <input id="domoLevel" type="text" name="level" placeholder="What are the Key words here?" />
            <input className="makeDomoSubmit" type="submit" value="Create Note" />
            <input name="_csrf" type="hidden" value={props.csrf} />
        </form>
    );
};

const DomoList = function(props) {
    if (props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }
    
    const domoNodes = props.domos.map(function(domo) {
        console.dir(domo);
        return (
            <div key={domo._id} className="domo">
                <h1 className="domoName">Title: {domo.name} </h1>
                <h2 className="domoAge">Idea: {domo.age} </h2>
                <div>
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