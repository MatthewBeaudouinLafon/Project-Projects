import React from 'react';
import YouTube from 'react-youtube'

var CHUNKS = [
    {
        type: "Text",
        content: {
            text:"My god this is a chunk of text. I never could have figured out how chunky it gets out there in terms of text."        
        }
    },
    {
        type: "Text",
        content: {
            text:"My god, another one? I can't believe it."        
        }
    },
    {
        type:"Image",
        content: {
            link:"https://i.ytimg.com/vi/tntOCGkgt98/maxresdefault.jpg",
            alt:"This is a cat in burriot form",
            description:"The famed \"Burrito Cat\""
        }
    },
    {
        type:"Text",
        content:{
            text:"Yo did you see that cat?"
        }
    },
    {
        type:"Video",
        content: {
            link:"https://youtu.be/_O-WEiOlxr4",
            description:"Scientific investigation in \"Wow Wow\" technologies"
        }
    }

]

//TODO: Smooth transition between editing and saving
export default class ProjectForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editing: false,
            isSaved: false,
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

    updateFromDB(json) {
        console.log(json)
        // CAUTION: Change when we change the backend to have one list of chunks
        this.setState(Object.assign({}, this.state, {
            projectName: json.title,
            projectDesc: json.description,
            projectSemester: json.semester,
            authors: json.members,
            chunkList: json.chunk_list, 
            query: this.state.query
        }));
    }

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

    handleChunkChange(newContent, key) {
        let newChunkList = this.state.chunkList;
        newChunkList[key].content = newContent;

        this.setState(Object.assign({}, this.state, {
            chunkList:newChunkList
        }));
    }

    // TODO: Refactor to have Chunk component, and Text/Image/Video subcomponents
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

    changeEditState() {
        if (this.state.editing) {
            console.log("Saving...")

            // TODO: Also deal with changing project name, description and author list.
            const projectId = 1234567

            const data = JSON.stringify(this.state.chunkList);
            console.log(data)
            fetch('/api/project/project_id=' + projectId, {
                method: "POST",
                contentType: 'application/json',
                body: JSON.stringify(this.state.chunkList)
            })
            .then(function(res){ return res.json(); })
            .then(function(data){ alert(JSON.stringify(data))})

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
                                                        {}, this.state, {projectDesc: newDescription}))
                                               }/>
                {displayChunks}
                <NewChunk addChunk={this.addChunk} editing={this.state.editing}/>
            </div>
        );
    }
}

class FormHeader extends React.Component {
    render() {
        const authorList = this.props.authors.join(", ");

        //TODO: Make author list editable
        //TODO: Reconsider using a Text Chunk for the description (makes sense to the user?)
        return (
            <div>
                <div className="form-header">
                    <div>
                        <div className="form-project-name">
                            Project Name: <b>{this.props.name}</b>                    
                        </div>
                        <div className="project-authors">
                            {authorList}
                        </div>
                    </div>
                    <div className="form-save-button">
                        <Button name={this.props.editing ? "Save" : "Edit"} func={this.props.save} />
                    </div>
                </div>
                <Chunk 
                    chunkType={"Text"}
                    content={{text:this.props.description}}
                    editing={this.props.editing} 
                    handleTextChange={(newContent) => {this.props.handleDescChange(newContent)}} 
                />
            </div>
        );
    }
}

class Chunk extends React.Component {
    constructor(props) {
        super(props);

        this.handleFieldChange = this.handleFieldChange.bind(this);

        this.getTextChunk = this.getTextChunk.bind(this);
        this.getImageChunk = this.getImageChunk.bind(this);
        this.getVideoChunk = this.getVideoChunk.bind(this);
    }

    handleFieldChange(changedContentField, fieldName) {
        const newContent = Object.assign(
                {}, 
                this.props.content, 
                {[fieldName]:changedContentField}
        );
        this.props.handleChunkChange(newContent);
    }

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

    getVideoChunk() {
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
    render() {
        return (
            <div>
                <p>Uh Oh... Chunk Not Recognized?</p>
            </div>
        );
    }
}

class NewChunk extends React.Component {
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
            <button className="new-chunk-button pulse" onClick={this.handleClick}>{this.props.name}</button>
        );
    }
}

class SmallInput extends React.Component {
    render() {
        return (
            <input  
                className="small-input"
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
