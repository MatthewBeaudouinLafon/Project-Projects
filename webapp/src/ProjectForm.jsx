import React from 'react';

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
        content:"Yo did you see that cat? Some say it's \"cute af\""
    }

// TODO: Look into react-youtube: https://github.com/troybetz/react-youtube
// ,
//     {
//         type:"Video",
//         content:"https://youtu.be/_O-WEiOlxr4"
//     }

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
                    content: ""
                }
                break;
            case "Video":
                chunk = {
                    type: "Video",
                    content: ""
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
                return <TextChunk content={chunk.content} editing={this.state.editing} 
                                    handleTextChange={(newValue) => {this.handleChunkChange(newValue, key)}} 
                                    key={key}/>
                break;
            case "Image":
                return <ImageChunk content={chunk.content} editing={this.state.editing} key={key}/>
                break;
            case "Video":
                return <VideoChunk content={chunk.content} editing={this.state.editing} key={key}/>
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
    render() {
        return (
            <div className="chunk-container">
                <div className="image-chunk">
                    <img className="image" src={this.props.content.link} alt={this.props.content.alt}/>
                    <div className="description">
                        {this.props.content.description}
                    </div>
                </div>
            </div>
        );
    }
}

class VideoChunk extends React.Component {
    render() {
        return (
            <div className="chunk-container">
                <iframe src={this.props.content} frameBorder="0" allowFullScreen></iframe>
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
        console.log(this.props)
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
