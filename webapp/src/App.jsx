import React from 'react';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            allProjects: [],
            displayProjects: [],
            query: "",
            timeout: {
                id: undefined,
                isRunning: false
            }
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
        let filteredProjects = this.state.allProjects;
        console.log(parsedQuery)
        keys.forEach((key) => {
            switch (key) {
                case "prefix":
                    filteredProjects = filteredProjects.filter((project) => {
                        return project.title.includes(parsedQuery["prefix"]);
                    });
                break;
                case "with":
                    filteredProjects = filteredProjects.filter((project) => {
                        let hasEveryone = true;
                        //TODO: Protect Regex (if user inputs | for example)
                        const regex = new RegExp("(.*(" + parsedQuery["with"].replace(/, /, "|") + ").*)+")
                        return regex.test(project.members.join("|"))
                    });
                break;
            }
            this.setState(Object.assign({}, this.state, {
                displayProjects: filteredProjects,
                timeout: {
                    id: undefined,
                    isRunning: false
                }
            }));
        })
    }

    render() {
        let grid = null;

        if (this.state.displayProjects !== []) {
            grid = <ProjectGrid projectList={this.state.displayProjects} />
        } else {
            grid = <div>No projects here!</div> 
        }

        const keys = ["prefix", "with"];

        return (
            <div>
                <div>
                    <center><h1>Project: Projects (U/C)</h1>
                    <h2>Students and Professors Side</h2></center>
                    <SearchBar 
                        query={this.state.query}
                        keys={keys}
                        handleSearch={(parsedQuery) => {
                            const timerLength = 1000; //ms
                            
                            if (this.state.timeout.isRunning) {
                                window.clearTimeout(this.state.timeout.id)
                            }

                            this.setState(Object.assign({}, this.state, {
                                query: parsedQuery["query"],
                                timeout: {
                                    id: window.setTimeout(
                                            this.performSearch, 
                                            timerLength, 
                                            parsedQuery, 
                                            keys),
                                    isRunning: true
                                }
                            }));
                        }} />
                </div>
                <ProjectGrid projectList={this.state.displayProjects} />
            </div>
        );
    }
}

class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.parseStr = this.parseStr.bind(this)
    }

    parseStr(str) {
        // Returns object of parsed string
        let parsed = {
            query: str
        };

        this.props.keys.forEach((key) => {
            parsed = Object.assign({}, parsed, {
                [key]: ""
            })
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
        return parsed
    }

    render() {
        return (
            <input className="search-bar" 
                   type="text" 
                   placeholder="Search..." 
                   value={this.props.query} 
                   onChange={(event => {
                       this.props.handleSearch(this.parseStr(event.target.value))
                   })} />
        );
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
        var name = this.props.project.title;
        var authorList = this.props.project.members;
        var description = this.props.project.description;
        return (
            <div className="project-item">
                <ProjectName className="project-name" name={name} />
                <AuthorList className="project-authors" authorList={authorList} />
                <Description className="project-description" description={description} />
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

var SlideShow = React.createClass({
    displayName: 'slideshow',
    render: function() {
        var s = document.createElement('script');
        s.innerHTML = "var slideIndex = 0;" +
        "showSlides();" +
        "function showSlides() {" +
        "var i; var slides = document.getElementsByClassName('mySlides'); var dots = document.getElementsByClassName('dot'); for (i = 0; i < slides.length; i++)" +
        "{ slides[i].style.display = 'none';}" + 
        "slideIndex++; if (slideIndex> slides.length) {slideIndex = 1}" +  
        "for (i = 0; i < dots.length; i++) {" +
        "dots[i].className = dots[i].className.replace('active', '');"+
    "} slides[slideIndex-1].style.display = 'block'; dots[slideIndex-1].className += 'active'; setTimeout(showSlides, 2000);}"
    document.head.appendChild(s);
    return (<div dangerouslySetInnerHTML={{__html: x}}></div>);
    }
});