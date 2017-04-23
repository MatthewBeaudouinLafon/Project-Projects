import React from 'react';
import ReactDOM from 'react-dom';
import {CompositeDecorator, Editor, EditorState} from 'draft-js';
import {toOlinEpoch, fromOlinEpoch} from './helper.js' 
import { Link } from 'react-router-dom'
import { Router, Route, IndexRoute, hashHistory, browserHistory } from 'react-router'

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            allProjects: [],
            displayProjects: []
        }

        this.updateFromDB = this.updateFromDB.bind(this);
        this.performSearch = this.performSearch.bind(this);
    }

    updateFromDB(json) {
        console.log("Getting projects from Database")
        this.setState(Object.assign({}, this.state, {
            allProjects: json,
            displayProjects: json,
            query: this.state.query
        }));
    }

    componentDidMount() {
        const updateFromDB = this.updateFromDB; 

        fetch('/api/.*')
        .then(function(response) {
            response.json().then(function(json) {
                updateFromDB(json)
            })
        })
    }

    performSearch(parsedQuery, keys) {
        //TODO: Loading icon?

        const stopwords = ['a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any',
            'are', "aren't", 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both',
            'but', 'by', "can't", 'cannot', 'could', "couldn't", 'did', "didn't", 'do', 'does', "doesn't",
            'doing', "don't", 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', "hadn't", 
            'has', "hasn't", 'have', "haven't", 'having', 'he', "he'd", "he'll", "he's", 'her', 'here', "here's",
            'hers', 'herself', 'him', 'himself', 'his', 'how', "how's", 'i', "i'd", "i'll", "i'm", "i've", 'if',
            'in', 'into', 'is', "isn't", 'it', "it's", 'its', 'itself', "let's", 'me', 'more', 'most', "mustn't",
            'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our',
            'ours', 'ourselves', 'out', 'over', 'own', 'same', "shan't", 'she', "she'd", "she'll", "she's",
            'should', "shouldn't", 'so', 'some', 'such', 'than', 'that', "that's", 'the', 'their', 'theirs',
            'them', 'themselves', 'then', 'there', "there's", 'these', 'they', "they'd", "they'll", "they're",
            "they've", 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', "wasn't",
            'we', "we'd", "we'll", "we're", "we've", 'were', "weren't", 'what', "what's", 'when', "when's", 'where',
            "where's", 'which', 'while', 'who', "who's", 'whom', 'why', "why's", 'with', "won't", 'would', "wouldn't",
            'you', "you'd", "you'll", "you're", "you've", 'your', 'yours', 'yourself', 'yourselves'];

        let filteredProjects = this.state.allProjects;
        console.log(parsedQuery)
        keys.forEach((key) => {
            if (parsedQuery[key] !== ""){
                switch (key) {
                    case "prefix":
                        const usefulQuery = parsedQuery["prefix"];

                        stopwords.forEach((word) => {
                            usefulQuery.replace(word, "");
                        })

                        filteredProjects = filteredProjects.filter((project) => {
                            const regex = new RegExp("(.*(" + usefulQuery.replace(" ", ".+") + ").*)+");
                            return regex.test(project.title.toLowerCase());
                            // return project.title.toLowerCase().includes(usefulQuery);
                        });
                    break;
                    case "with":
                        filteredProjects = filteredProjects.filter((project) => {
                            //TODO: Protect Regex (if user inputs | for example)
                            const regex = new RegExp("(.*(" + parsedQuery["with"].replace(/, /, "|") + ").*)+");
                            let lMembers = [];
                            project.members.forEach((member) => {lMembers.push(member.toLowerCase());});
                            return regex.test(lMembers.join("|"));
                        });
                    case "during":
                        filteredProjects = filteredProjects.filter((project) => {
                            return (project.semester === toOlinEpoch(parsedQuery["during"]));
                        });
                    break;
                    case "before":
                        filteredProjects = filteredProjects.filter((project) => {
                            return (project.semester < toOlinEpoch(parsedQuery["before"]));
                        });
                    break;
                    case "after":
                        filteredProjects = filteredProjects.filter((project) => {
                            return (project.semester > toOlinEpoch(parsedQuery["after"]));
                        });
                    break;
                }
            }
            this.setState(Object.assign({}, this.state, {
                displayProjects: filteredProjects
            }));
        })
    }

    render() {
        let grid;

        if (this.state.displayProjects.length === 0) {
            grid = <div className="project-empty-grid">No projects here!</div>
        } else {
            grid = <ProjectGrid projectList={this.state.displayProjects} /> 
        }

        const keys = ["prefix", "with", "during", "before", "after"];

        return (
            <div>
                <div>
                    <center><h1>Project: Projects (U/C)</h1>
                    <h2>Students and Professors Side</h2></center>
                    <SearchBar 
                        query={this.state.query}
                        keys={keys}
                        performSearch={this.performSearch} />
                </div>
                {grid}
            </div>
        );
    }
}

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    const keywordRegex = new RegExp("(" + this.props.keys.join("|") + ")")

    function findWithRegex(regex, contentBlock, callback) {
        const text = contentBlock.getText();
        let matchArr, start;
        matchArr = regex.exec(text)
        if (matchArr) {
            start = matchArr.index;
            callback(start, start + matchArr[0].length);
        }
    }

    const styles = {
        keywords: {
            color: "rgba(98, 177, 254, 1.0)",
            fontWeight: "bold"
        }
    }

    const compositeDecorator = new CompositeDecorator([{
        strategy: (contentBlock, callback, contentState) => {
            findWithRegex(keywordRegex, contentBlock, callback);
        },
        component: (props) => {
            return <span style={styles.keywords}>{props.children}</span>;
        }
    }])
    
    this.state = {
        editorState: EditorState.createEmpty(compositeDecorator),
        query: "",
        timeout: {
            id: null,
            isRunning: false
        }
    };

    this.parseStr = this.parseStr.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(editorState) {
    if (editorState.getCurrentContent().getPlainText() !== this.state.editorState.getCurrentContent().getPlainText()){
        const parsedQuery = this.parseStr(editorState.getCurrentContent().getPlainText());
        const timerLength = 1000; //ms

        if (this.state.timeout.isRunning) {
            clearTimeout(this.state.timeout.id);
        }

        this.setState(Object.assign({}, this.state, {
            editorState: editorState,
            timeout: {
                id: setTimeout(
                    (parsedQuery, keys) => {
                        this.props.performSearch(parsedQuery, keys);
                        this.setState(Object.assign({}, this.state, {
                            timeout: {
                                id: null,
                                isRunning: false
                            }
                        }))
                    },
                    timerLength, 
                    parsedQuery, 
                    this.props.keys
                ),
                isRunning: true
            }
        }));
    } else {
        this.setState(Object.assign({}, this.state, {
            editorState: editorState
        }));
    };
        
}

  parseStr(str) {
        // Returns object of parsed string
        let parsed = {
            query: str
        };
        str = str.toLowerCase();

        this.props.keys.forEach((key) => {
            parsed = Object.assign({}, parsed, {
                [key]: ""
            });
        })

        let currentWord = "prefix";
        const words = str.split(" ");

        words.forEach((word) => {
            if (this.props.keys.includes(word)) {
                currentWord = word;
            } else {
                parsed[currentWord] += (parsed[currentWord]) ? (" " + word) : (word);
            }
        });

        return parsed;
    }

  render() {
    return <div className="search-bar">
                <Editor editorState={this.state.editorState} onChange={this.handleSearch} />
           </div>
  }
}

class ProjectGrid extends React.Component {
    render() {
        var projects = [];
        this.props.projectList.forEach(function(project) {
            projects.push(<ProjectItem className="project-item" project={project} key={project._id}/>)
        });
        return (
            <div className="project-grid">
                {projects}
            </div>
        );
    }
}

class ProjectItem extends React.Component {
    render() {
        var project_id = this.props.project._id;
        var name = this.props.project.title;
        var authorList = this.props.project.members;
        var description = this.props.project.description;
        return (
            <div className="project-item">
                <Link to={"/main/" + project_id}>
                    <ProjectName className="project-name" name={name} />
                    <AuthorList className="project-authors" authorList={authorList} />
                    <Description className="project-description" description={description} />
                </Link>
            </div>

        );
    }
}

class ProjectName extends React.Component {
    render() {
        return (
            <div className="project-name"> {this.props.name} </div>
        );
    }
}

class Description extends React.Component {
    render() {
        return (
            <div className="project-description"> {this.props.description} </div>
        );
    }
}

class AuthorList extends React.Component {
    render() {
        return (
            <div className="project-authors">{this.props.authorList.join(', ')}</div>
        );
    }
}

// class ____ extends React.Component {
//     render() {
//         return (
            
//         );
//     }
// }