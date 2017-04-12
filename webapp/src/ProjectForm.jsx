import React from 'react';
import YouTube from 'react-youtube'

var CHUNKS = [
    {
        type: "Text",
        content: "My god this is a chunk of text. I never could have figured out how chunky it gets out there in terms of text."        
    },
    {
        type: "Text",
        content: "My god, another one? I can't believe it."        
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
        content:"Yo did you see that cat?"
    },
    {
        type:"Video",
        content: {
            link:"https://youtu.be/_O-WEiOlxr4"
        }
    }

]

export default class ProjectForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editing: false,
            isSaved: false,
            chunkList: CHUNKS,
            projectName: "Test Name"
        }

        this.getProjectName = this.getProjectName.bind(this)
        this.addChunk = this.addChunk.bind(this)
        this.convertChunk = this.convertChunk.bind(this)
        this.changeEditState = this.changeEditState.bind(this)
        this.handleChunkChange = this.handleChunkChange.bind(this)
    }

    getProjectName() {
        // TODO: URL query with react-router
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

        this.setState({
            editing: this.state.editing,
            isSaved: this.state.isSaved,
            chunkList: newChunkList,
            projectName: this.state.projectName
        })
    }

    handleChunkChange(newContent, key) {
        let newChunkList = this.state.chunkList;
        newChunkList[key].content = newContent;

        this.setState({
            editing: this.state.editing,
            isSaved: this.state.isSaved,
            chunkList: newChunkList,
            projectName: this.state.projectName
        })
    }

    convertChunk(chunk, key) {
        switch (chunk.type) {
            case "Text":
                return <TextChunk 
                            content={chunk.content} 
                            editing={this.state.editing} 
                            handleTextChange={(newContent) => {this.handleChunkChange(newContent, key)}} 
                            key={key}/>
                break;
            case "Image":
                return <ImageChunk 
                            content={chunk.content}
                            editing={this.state.editing}
                            handleDescChange={(newContent) => {this.handleChunkChange(newContent, key)}}
                            handleLinkChange={(newContent) => {this.handleChunkChange(newContent, key)}}
                            key={key}/>
                break;
            case "Video":
                return <VideoChunk 
                            content={chunk.content}
                            editing={this.state.editing}
                            handleLinkChange={(newContent) => {this.handleChunkChange(newContent, key)}}
                            key={key}/>
                break;
            default:
                console.log("Can't parse chunk with type : " + chunk.type);
                return <EmptyChunk />
        }
    }

    changeEditState() {
        if (this.state.editing) {
            //TODO: Actually Save the thing
            console.log("Saving...")
            this.setState({
                editing: false,
                isSaved: this.state.isSaved,
                chunkList: this.state.chunkList,
                projectName: this.state.projectName
            })
        } else {
            this.setState({
                editing: true,
                isSaved: this.state.isSaved,
                chunkList: this.state.chunkList,
                projectName: this.state.projectName
            })
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
                            save={this.changeEditState} 
                            editing={this.state.editing}/>
                {displayChunks}
                <NewChunk addChunk={this.addChunk} editing={this.state.editing}/>
            </div>
        );
    }
}

class FormHeader extends React.Component {
    render() {

        return (
            <div className="form-header">
                <div className="form-project-name">
                    Project Name: <b>{this.props.name}</b>
                </div>
                <div className="form-save-button">
                    <Button name={this.props.editing ? "Save" : "Edit"} func={this.props.save} />
                </div>
            </div>
        );
    }
}

class TextChunk extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.getTextBox = this.getTextBox.bind(this);
    }

    handleChange(event) {
        this.props.handleTextChange(event.target.value);
    }

    getTextBox(props) {
        if (props.editing) {
            return <textarea className="text-chunk-input" value={props.content} onChange={this.handleChange}/>;
        } else {
            return <div className="text-chunk-input">{props.content}</div>;
        }
    }

    render() {
        //TODO: Make text box scale with size
        const textBox = this.getTextBox(this.props);
        return (
            <div className="chunk-container">
                {textBox}    
            </div>
        );
    }
}

class ImageChunk extends React.Component {
    constructor(props) {
        super(props);

        this.handleLinkChange = this.handleLinkChange.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        this.getImageChunk = this.getImageChunk.bind(this);
    }

    handleLinkChange(event) {
        const newContent = {
            link: event.target.value,
            description: this.props.content.description,
            alt: this.props.content.alt
        }
        this.props.handleLinkChange(newContent);
    }

    handleDescChange(event) {
        const newContent = {
            link: this.props.content.link,
            description: event.target.value,
            alt: this.props.content.alt
        }
        this.props.handleDescChange(newContent);
    }

    getImageChunk() {
        let image;
        // TODO: Manage links in a more secure way
        if (this.props.content.link === "") {
            image = <div className="image" />
        } else {
            image = <img className="image" src={this.props.content.link} alt={this.props.content.alt}/>
        }

        if (this.props.editing) {
            return <div className="image-chunk">
                        <input  
                            className="small-input"
                            value={this.props.content.link}
                            onChange={this.handleLinkChange}
                        />
                        {image}
                        <input  
                            className="small-input"
                            value={this.props.content.description}
                            onChange={this.handleDescChange}
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
    render() {
        return (
            <div className="chunk-container">
                {this.getImageChunk()}
            </div>
        );
    }
}

class VideoChunk extends React.Component {
    constructor(props) {
        super(props);

        this.handleLinkChange = this.handleLinkChange.bind(this);
        this.youtube_parser = this.youtube_parser.bind(this);
    }

    handleLinkChange(event) {
        const newContent = {
            link: event.target.value
        }
        this.props.handleLinkChange(newContent);
    }

    youtube_parser(url){
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        return (match && match[7].length == 11) ? match[7] : false;
    }

    render() {
        const opts = {
            height: "315",
            width: "420"
        }

        let urlBox = null;
        if (this.props.editing) {
            urlBox = <input  
                        className="small-input"
                        value={this.props.content.link}
                        onChange={this.handleLinkChange}
                     />
        }

        return (
            <div className="chunk-container">
                <div className="video-container">
                    {urlBox}
                    <YouTube
                      videoId={this.youtube_parser(this.props.content.link)}
                      className="youtube-video"
                      opts={opts}
                    />
                </div>
            </div>
        );
    }
    _onReady(event) {
        // access to player in all event handlers via event.target
        event.target.pauseVideo();
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

// class ____ extends React.Component {
//     render() {
//         return (
            
//         );
//     }
// }
