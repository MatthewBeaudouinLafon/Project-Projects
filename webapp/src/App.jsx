import React from 'react';
import ReactDOM from 'react-dom';
import {CompositeDecorator, Editor, EditorState} from 'draft-js';
import {toOlinEpoch, fromOlinEpoch} from './helper.js'
import { Link } from 'react-router-dom'
import { Redirect, Route, IndexRoute, hashHistory, browserHistory } from 'react-router'

export default class ProjectBrowser extends React.Component {
    /*
    Root component for the project browser.

    state
        allProjects (json list):        List of all projects retrieved from the database json objects
        displayProjects (json list):    Subset of allProjects, filtered based on a query
        query (string):                 Query value (as seen in the search bar)
    */
    constructor(props) {
        super(props);

        this.state = {
            allProjects: [],
            displayProjects: [],
            query: ''
        }

        this.updateFromDB = this.updateFromDB.bind(this);
        this.performSearch = this.performSearch.bind(this);
    }

    // Update state based on json response
    updateFromDB(json) {
        console.log("Getting projects from Database")
        this.setState(Object.assign({}, this.state, {
            allProjects: json,
            displayProjects: json,
            query: this.state.query
        }));
    }

    // On mount, make a request for project
    componentDidMount() {
        const updateFromDB = this.updateFromDB;

        fetch('/api/all_projects')
        .then(function(response) {
            response.json().then(function(json) {
                updateFromDB(json)
            })
        })
    }

    // Take parsed query and keywords from the search bar and set displayProjects accordingly
    performSearch(parsedQuery, keys) {
        //TODO: Loading icon?

        // Words to ignore in the search. Make sure keywords aren't in here.
        const stopwords = ['a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any',
            'are', "aren't", 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both',
            'but', 'by', "can't", 'cannot', 'could', "couldn't", 'did', "didn't", 'do', 'does', "doesn't",
            'doing', "don't", 'down', 'each', 'few', 'for', 'from', 'further', 'had', "hadn't",
            'has', "hasn't", 'have', "haven't", 'having', 'he', "he'd", "he'll", "he's", 'her', 'here', "here's",
            'hers', 'herself', 'him', 'himself', 'his', 'how', "how's", 'i', "i'd", "i'll", "i'm", "i've", 'if',
            'in', 'into', 'is', "isn't", 'it', "it's", 'its', 'itself', "let's", 'me', 'more', 'most', "mustn't",
            'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our',
            'ours', 'ourselves', 'out', 'over', 'own', 'same', "shan't", 'she', "she'd", "she'll", "she's",
            'should', "shouldn't", 'so', 'some', 'such', 'than', 'that', "that's", 'the', 'their', 'theirs',
            'them', 'themselves', 'then', 'there', "there's", 'these', 'they', "they'd", "they'll", "they're",
            "they've", 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', "wasn't",
            'we', "we'd", "we'll", "we're", "we've", 'were', "weren't", 'what', "what's", 'when', "when's", 'where',
            "where's", 'which', 'while', 'who', "who's", 'whom', 'why', "why's", "won't", 'would', "wouldn't",
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
                    break;
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

        // Make sure to add new keywords here.
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
    /*
    Search Bar component. Handles query searching to be independent of specific keywords.
    Used Draftjs for highlighting features

    state
        editorState (EditorState):  Draftjs EditorState object
        query (string):             Search bar display value
        timeout: {
            id (int):               setTimout id
            isRunning (bool):       Whether a timer is currently running
        }
    */
    constructor(props) {
        super(props);

        const keywordRegex = new RegExp("(" + this.props.keys.join("|") + ")")

        // Find match location using regex
        function findWithRegex(regex, contentBlock, callback) {
            const text = contentBlock.getText();
            let matchArr, start;
            matchArr = regex.exec(text)
            if (matchArr) {
                start = matchArr.index;
                callback(start, start + matchArr[0].length);
            }
        }

        // TODO: Make and use css class
        // Styling for highlighted keywords
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

    // Handle search. While this function is called every time the field changes,
    // the search only gets run 1s after the last input.
    handleSearch(editorState) {
        if (editorState.getCurrentContent().getPlainText() !== this.state.editorState.getCurrentContent().getPlainText()){
            const parsedQuery = this.parseStr(editorState.getCurrentContent().getPlainText());
            const timerLength = 1000; //ms

            // Reset timer if there is new input while there is already a timer
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

    // Returns object of parsed string
    parseStr(str) {
        let parsed = {
            query: str
        };
        str = str.toLowerCase();

        this.props.keys.forEach((key) => {
            parsed = Object.assign({}, parsed, {
                [key]: ""
            });
        })

        let currentWord = "prefix"; // Prefix refers to the section of the query without keywords
                                    // TODO: consider making prefix an actual keyword
        const words = str.split(" ");

        words.forEach((word) => {
            if (this.props.keys.includes(word)) {
                currentWord = word;
            } else {
                parsed[currentWord] += (parsed[currentWord]) ? (" " + word) : (word);
            }
        });

        // Return dictionary of keywords with associated query (passed up to ProjectBrowser)
        return parsed;
    }

    render() {
        return <div className="search-bar">
                    <Editor editorState={this.state.editorState} onChange={this.handleSearch} />
               </div>
  }
}

class ProjectGrid extends React.Component {
    /*
    Renders the project grid.

    props
        projectList (json list):    List of projects to be displayed
    */
    render() {
        var projects = [<NewProject className="project-item" key={0}/>]; // Initialize with "new project" project

        // Convert projects to ProjectItem components
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

class NewProject extends React.Component {
    /*
    First "project" in the grid. Allows for creation of new projects.

    state
        redirect (bool):            Is it time to redirect?
        projectId (int):            Project id generated by Mongo
        newProjectName (string):    Name of new project
        githubInput (string):       Github URL

    */
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            projectId: null,
            newProjectName: "",
            githubInput: "",
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={"/main/" + this.state.projectId}/>
        }

        return (
            // Note/TODO: This should be fragmented into a new component, as it was hastily written close to the demo
            <div className="project-item new-project" >
                <div className="new-project-title">
                    New Project
                    <br/><br/>
                    <form method="POST">
                    <div style={{display: "inline-block", paddingRight: "0.4em"}} onClick={() => {
                            let projectId;
                            //TODO: suck less
                            let that = this;
                            fetch('/api/new_project/' + this.state.newProjectName)
                            .then(function(response) {
                                response.json()
                                .then((json) => {
                                    that.setState(Object.assign({}, that.state, {redirect: true, projectId: json}))
                                })
                            })
                        }}>+</div><input
                        type="text"
                        placeholder="Enter new project"
                        value={this.state.newProjectName}
                        onChange={(event) => {
                            this.setState(Object.assign({}, this.state, {newProjectName: event.target.value}))
                        }}
                        /><br/><br/>
                    <div
                        style={{display: "inline-block", paddingRight: "0.4em"}} onClick={() => {
                            let projectId;
                            //TODO: suck less
                            let that = this;
                            fetch('/api/new_project/github/' + this.state.githubInput)
                            .then(function(response) {
                                response.json()
                                .then((json) => {
                                    that.setState(Object.assign({}, that.state, {redirect: true, projectId: json}))
                                })
                            })
                        }}>+</div><input
                        type="text"
                        placeholder="GitHub URL (optional)"
                        value={this.state.githubInput}
                        onChange={(event) => {
                            this.setState(Object.assign({}, this.state, {githubInput: event.target.value}))
                        }}
                        onClick={() => {
                            let projectId;
                            //TODO: suck less
                            let that = this;
                            fetch('/api/new_project/' + this.state.githubInput)
                            .then(function(response) {
                                response.json()
                                .then((json) => {
                                    that.setState(Object.assign({}, that.state, {redirect: true, projectId: json}))
                                })
                            })
                        }}
                        />
                    </form>
                </div>
            </div>
        );
    }
}

class ProjectItem extends React.Component {
    /*
    One of the projects in the grid.

    TODO: Include semester
    props
        project {
            _id (int):              MongoDB id
            name (string):          Name of the project
            description (string):   Description of the project
            members (string list):  List of contributors to the project
        }
    */
    render() {
        const project_id = this.props.project._id;
        if (project_id.includes("project")){
            console.log(this.props);
        }
        const name = this.props.project.title;
        const authorList = this.props.project.members;
        const description = this.props.project.description;
        return (
            <div className="project-item">
                    <Link to={"/main/" + project_id}><ProjectName className="project-name" name={name} /></Link>
                    <AuthorList className="project-authors" authorList={authorList} />
                    <Description className="project-description" description={description} />

            </div>
        );
    }
}

class ProjectName extends React.Component {
    /*
    Renders project name

    props
        name (string): Name of project
    */
    render() {
        return (
            <div className="project-name"> {this.props.name} </div>
        );
    }
}

class Description extends React.Component {
    /*
    Renders description

    props
        description (string): Project description
    */
    render() {
        return (
            <div className="project-description"> {this.props.description} </div>
        );
    }
}

class AuthorList extends React.Component {
    /*
    Renders list of members

    props
        authorList (string): list of contributors
    */
    render() {
        let authorList;
        if(this.props.authorList.constructor===Array)
            authorList = this.props.authorList.join(", ");
        else
            authorList = this.props.authorList;
        return (
            <div className="project-authors">{authorList}</div>
        );
    }
}

// class ____ extends React.Component {
//     render() {
//         return (

//         );
//     }
// }
