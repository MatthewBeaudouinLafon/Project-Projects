import React from 'react';
import YouTube from 'react-youtube'

//TODO: Smooth transition between editing and saving
export default class ProjectForm extends React.Component {
    /*
    Root component for the project form page.

    state
        editing (bool):             Whether the project is being edited
        editHistory (Chunk list):   List of chunks from previous edits (to be implemented)
        chunkList (json list):      List of json objects describing each chunk
        projectName :               Name of the project
        projectDesc :               Description of the project as seen in the project browser
        projectSemester :           Semester the project took place in Olin Epoch

    */
    constructor(props) {
        super(props);

        this.state = {
            editing: false,
            editHistory: [],
            chunkList: [],
            projectName: "",
            projectDesc: "",
            projectSemester: "",
            authors: []
        }

        this.addChunk = this.addChunk.bind(this)
        this.convertChunk = this.convertChunk.bind(this)
        this.changeEditState = this.changeEditState.bind(this)
        this.handleChunkChange = this.handleChunkChange.bind(this)
        this.updateFromDB = this.updateFromDB.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
    }

    // Update state based on json response
    updateFromDB(json) {
        this.setState(Object.assign({}, this.state, {
            projectName: json.title,
            projectDesc: json.description,
            projectSemester: json.semester,
            authors: json.members,
            chunkList: json.chunk_list
        }));
    }

    // On mount, make a request for project
    componentDidMount() {
        const updateFromDB = this.updateFromDB;
        const projectId = /(\w+)$/.exec(this.props.location.pathname)[0] // Matches and retrieves project id from the end of the url
        fetch('/api/project/' + projectId)
        .then(function(response) {
            response.json().then((json) => {
                updateFromDB(json)
            })
        })
    }

    // Add a new chunk, style depending on the button pressed
    addChunk(context) {
        let chunk = null;
        const type = context.buttonName
        switch (type) {
            case "Text":
                chunk = {
                    type: "Text",
                    content: ""
                }
                break;
            case "Image":
                chunk = {
                    type: "Image",
                    content: {
                        link: "",
                        alt: "",
                        description: ""
                    }
                }
                break;
            case "Video":
                chunk = {
                    type: "Video",
                    content: {
                        link: ""
                    }
                }
                break;
            default:
                console.log("Unknown Type:" + type)
        }

        let newChunkList = this.state.chunkList;
        newChunkList.push(chunk);

        this.setState(Object.assign({}, this.state, {
            chunkList:newChunkList
        }));
    }

    // Update appropriate chunk
    handleChunkChange(newContent, key) {
        let newChunkList = this.state.chunkList;
        newChunkList[key].content = newContent;

        this.setState(Object.assign({}, this.state, {
            chunkList: newChunkList
        }));
    }

    // Convert json representation of a chunk into React Component
    convertChunk(chunk, key) {
        return <Chunk
                    chunkType={chunk.type}
                    content={chunk.content}
                    editing={this.state.editing}
                    handleChunkChange={(newContent) => {this.handleChunkChange(newContent, key)}}
                    deleteChunk={() => {
                        let newChunkList = this.state.chunkList;
                        newChunkList.splice(key)

                        this.setState(Object.assign({}, this.state, {
                            chunkList:newChunkList
                        }));
                    }}
                    key={key}/>
    }

    // Toggle Edit state, save when going from editing to not.
    changeEditState() {
        if (this.state.editing) {
            console.log("Saving...")

            const projectId = /(\w+)$/.exec(this.props.location.pathname)[0] // TODO: Probably put id in state
            const data = JSON.stringify({
                description: this.state.projectDesc,
                title: this.state.projectName,
                members: this.state.authors,
                semester: this.state.projectSemester,
                chunk_list: this.state.chunkList
            });

            fetch('/api/project/' + projectId, {
                method: "POST",
                contentType: 'application/json',
                body: data
            })

            this.setState(Object.assign({}, this.state, {
                editing: false,
            }));
        } else {
            this.setState(Object.assign({}, this.state, {
                editing: true,
            }));
        }

    }

    render() {
        // TODO: Consider optimizing edits to only re-render some stuff?
        let displayChunks = []
        let key = 0  // Corresponds to position in the list

        // Generate list of chunks for render
        this.state.chunkList.forEach((chunk) => {
            displayChunks.push(this.convertChunk(chunk, key));
            key++;
        });
        return (
            <div>
                <FormHeader name={this.state.projectName}
                            authors={this.state.authors}
                            description={this.state.projectDesc}
                            save={this.changeEditState}
                            editing={this.state.editing}
                            handleDescChange={
                                (newDescription) => this.setState(Object.assign(
                                                        {}, this.state, {projectDesc: newDescription.text}))
                            }
                            handleTitleChange={
                                (newTitle) => this.setState(Object.assign(
                                                        {}, this.state, {projectName: newTitle}))
                            }
                            handleAuthorsChange={
                                (newAuthors) => this.setState(Object.assign(
                                                        {}, this.state, {authors: newAuthors.split(', ')}))
                            }/>
                {displayChunks}
                <NewChunk addChunk={this.addChunk} editing={this.state.editing}/>
            </div>
        );
    }
}

class FormHeader extends React.Component {
    /*
    Top of the form. Contains project name, authors and description.

    props
        authors (string list):          list of authors
        editing (bool):                 editing state
        name (string):                  Project name
        handleTitleChange (function):   Update list of authors in projectForm state
        handleAuthorChange (function):  Update list of authors in projectForm state
    */
    render() {
        const authorList = this.props.authors.join(", ");

        let projectName;
        let authors;

        // Depending on editing status, render fields as editable or as divs.
        if (this.props.editing) {
            projectName = <MediumInput
                value={this.props.name}
                handleFieldChange={
                   (newValue) => this.props.handleTitleChange(newValue)
                }
            />
            authors = <MediumInput
                value={this.props.authors.join(', ')}
                handleFieldChange={
                    (newValue) => this.props.handleAuthorsChange(newValue)
                }
            />
        } else {
            projectName =   <div className="form-project-name">
                                <b>{this.props.name}</b>
                            </div>
            authors =   <div className="project-authors">
                            {authorList}
                        </div>
        }

        //TODO: Reconsider using a Text Chunk for the description (confusing to the user? Should it look different?)
        return (
            <div>
                <div className="form-header">
                    <div>
                        {projectName}
                        {authors}
                    </div>
                    <div className="form-save-button">
                        <Button name={this.props.editing ? "Save" : "Edit"} func={this.props.save} />
                    </div>
                </div>
                <Chunk
                    chunkType={"Text"}
                    content={{text:this.props.description}}
                    editing={this.props.editing}
                    handleChunkChange={this.props.handleDescChange}
                />
            </div>
        );
    }
}

class Chunk extends React.Component {
    /*
    Renders chunk (text, image or video). Depending on the type, displays text, image or video with caption.
    Enables editing when appropriate.

    props
        chunkType (string):             Type of Chunk (Text, Image or Video)
        content (json object):          Chunk content. Can containt text, image or youtube link with caption.
        editing (bool):                 Editing state
        handleChunkChange (function):   Takes new content, and name of the field to update

    */
    constructor(props) {
        super(props);

        this.handleFieldChange = this.handleFieldChange.bind(this);

        this.getTextChunk = this.getTextChunk.bind(this);
        this.getImageChunk = this.getImageChunk.bind(this);
        this.getVideoChunk = this.getVideoChunk.bind(this);
    }

    // Formats input for this.props.handleChunkChange
    handleFieldChange(changedContentField, fieldName) {
        const newContent = Object.assign(
                {},
                this.props.content,
                {[fieldName]:changedContentField}
        );
        this.props.handleChunkChange(newContent);
    }

    // Construct Text Chunk, depending on edit status
    getTextChunk() {
        if (this.props.editing) {
            return <textarea className="text-chunk-input"
                             value={this.props.content.text}
                             onChange={(event) => this.handleFieldChange(event.target.value, "text")}
                    />
        } else {
            return <div className="text-chunk-input">{this.props.content.text}</div>;
        }
    }

    // Construct Image Chunk, depending on edit status
    getImageChunk() {
        let image;
        // TODO: Manage links in a more secure way
        if (this.props.content.link === "") {
            image = <div className="image" />
        } else {
            image = <img className="image"
                         src={this.props.content.link}
                         alt={this.props.content.alt}/>
        }

        if (this.props.editing) {
            return <div className="image-chunk">
                        <SmallInput value={this.props.content.link}
                                    handleFieldChange={
                                       (newValue) => this.handleFieldChange(newValue, "link")
                                    }
                        />
                        {image}
                        <SmallInput value={this.props.content.description}
                                    handleFieldChange={
                                       (newValue) => this.handleFieldChange(newValue, "description")
                                    }
                     />
                    </div>
        } else {
            return <div className="image-chunk">
                        {image}
                        <div className="description">
                            {this.props.content.description}
                        </div>
                    </div>
        }
    }

    // Construct Video Chunk, depending on edit status
    getVideoChunk() {

        // TODO: Make this dynamically sized
        const opts = {
            height: "315",
            width: "420"
        }

        // Parse youtube link for videoId
        const url = this.props.content.link
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        const match = url.match(regExp);
        const videoId = (match && match[7].length == 11) ? match[7] : false;

        let urlBox;
        let description;
        if (this.props.editing) {
            urlBox = <SmallInput value={this.props.content.link}
                                 handleFieldChange={
                                    (newValue) => this.handleFieldChange(newValue, "link")
                                 }
                     />
            description = <SmallInput value={this.props.content.description}
                                      handleFieldChange={
                                         (newValue) => this.handleFieldChange(newValue, "description")
                                      }
                          />
        } else {
            description = <div className="description">
                            {this.props.content.description}
                          </div>
        }

        return  <div className="video-container">
                    {urlBox}
                    <YouTube
                      videoId={videoId}
                      className="youtube-video"
                      opts={opts}
                    />
                    {description}
                </div>
    }

    render() {
        let chunkContent = null
        switch (this.props.chunkType) {
            case "Text":
                chunkContent = this.getTextChunk();
                break;
            case "Video":
                chunkContent = this.getVideoChunk();
                break;
            case "Image":
                chunkContent = this.getImageChunk();
                break;
        }

        return (
            <div className="chunk-container">
                {chunkContent}
            </div>
        );
    }
}

class EmptyChunk extends React.Component {
    /*
    Used when chunk type is not recognized. This should really never get called.
    */
    render() {
        return (
            <div>
                <p>Uh Oh... Chunk Not Recognized?</p>
            </div>
        );
    }
}

class NewChunk extends React.Component {
    /*
    Form footer. When editing, it displays the new chunk buttons

    props
        editing (bool):         Editing state
        addChunk (function):    Adds appropriately typed chunk to the form

    */
    render() {
        let finalBlock = <div />;
        if (this.props.editing) {
            const buttons = ["Text", "Video", "Image"];

            let dispButtons = [];
            buttons.forEach((button) => {
                dispButtons.push(
                    <Button name={button} func={this.props.addChunk} key={button}/>
                )
            })
            finalBlock = (
                <div className="chunk-button-container">
                    {dispButtons}
                </div>
            );
        } else {
            finalBlock = (
                <div className="chunk-end" />
            );
        }
        return finalBlock;
    }
}

class Button extends React.Component {
    /*
    Generic button. Used for edit/save and new chunk buttons.

    props
        name (string):   Button label
        func (function): Function to call on click
    */
    constructor(props) {
        super(props)

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        this.props.func({
            buttonName: this.props.name
        });
    }

    render() {
        return (
            <button className="new-chunk-button pulse"
                    onClick={this.handleClick}>
                {this.props.name}
            </button>
        );
    }
}

class SmallInput extends React.Component {
    /*
    Generic small input. Used for editing captions.

    props
        value (string):                 Value to render
        handleFieldChange (function):   Takes new value. Function to call on value change.
    */
    render() {
        //TODO: Refactor to use Draft.js
        return (
            <input
                className="small-input"
                value={this.props.value}
                onChange={(event) => {this.props.handleFieldChange(event.target.value)}}
            />
        );
    }
}

class MediumInput extends React.Component {
    /*
    Generic Medium input. Used for editing text boxes.

    props
        value (string):                 Value to render
        handleFieldChange (function):   Takes new value. Function to call on value change.
    */
    render() {
        // TODO: Refactor to use Draft.js
        return (
            <input
                className="medium-input"
                value={this.props.value}
                onChange={(event) => {this.props.handleFieldChange(event.target.value)}}
            />
        );
    }
}

// class ____ extends React.Component {
//     render() {
//         return (

//         );
//     }
// }
