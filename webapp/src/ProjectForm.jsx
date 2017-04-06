import React from 'react';

var CHUNKS = [
    {
        type: "Text",
        content: "My god this is a chunk of text. I never could have figured out how chunky it gets out there in terms of text."        
    },
    {
        type: "Text",
        content: "My god, another one? I can't believe it."        
    }
]
// ,
//     {
//         type:"Image",
//         content:"https://i.ytimg.com/vi/tntOCGkgt98/maxresdefault.jpg"
//     },
//     {
//         type:"Text",
//         content:"Yo did you see that cat? Some say it's \"cute af\""
//     },
//     {
//         type:"Video",
//         content:"https://youtu.be/_O-WEiOlxr4"
//     }

// ]

export default class ProjectForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editing: true,
            isSaved: false,
            chunkList: CHUNKS,
            projectName: "Test Name"
        }

        this.getProjectName = this.getProjectName.bind(this)
        this.addChunk = this.addChunk.bind(this)
        this.convertChunk = this.convertChunk.bind(this)
        this.save = this.save.bind(this)
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
                return <TextChunk content={chunk.content} edit={this.state.editing} 
                                    handleTextChange={(newValue) => {this.handleChunkChange(newValue, key)}} 
                                    key={key}/>
                break;
            case "Image":
                return <ImageChunk content={chunk.content} edit={this.state.editing} key={key}/>
                break;
            case "Video":
                return <VideoChunk content={chunk.content} edit={this.state.editing} key={key}/>
                break;
            default:
                console.log("Can't parse chunk with type : " + chunk.type);
                return <EmptyChunk />
        }
    }

    save() {
        console.log("Saving...")
        this.setState({
            editing: false,
            isSaved: this.state.isSaved,
            chunkList: this.state.chunkList,
            projectName: this.state.projectName
        })
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
                <FormHeader name={this.state.projectName} save={this.save}/>
                {displayChunks}
                <NewChunk addChunk={this.addChunk}/>
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
                    <Button name="Save" func={this.props.save} />
                </div>
            </div>
        );
    }
}

class TextChunk extends React.Component {
    constructor(props) {
        super(props)

        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        this.props.handleTextChange(event.target.value);
    }

    render() {
        //TODO: Make text box scale with size
        return (
            <div className="text-chunk">
                <textarea className="text-chunk-input" value={this.props.content} onChange={this.handleChange}/>
            </div>
        );
    }
}

class ImageChunk extends React.Component {
    render() {
        return (
            <div>
                <img src={this.props.content} alt="Need to add this"/>
            </div>
        );
    }
}

class VideoChunk extends React.Component {
    render() {
        return (
            <div>
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
        const buttons = ["Text", "Video", "Image"];

        let dispButtons = [];
        buttons.forEach((button) => {
            dispButtons.push(<Button name={button} func={this.props.addChunk} key={button}/>)
        })
        return (
            <div className="new-chunk-container">
                {dispButtons}
            </div>
        );
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
            <div className="new-chunk-button" onClick={this.handleClick}>{this.props.name}</div>
        );
    }
}


// class SaveButton extends React.Component {
//     render() {
//         return (
            
//         );
//     }
// }



// class ____ extends React.Component {
//     render() {
//         return (
            
//         );
//     }
// }
