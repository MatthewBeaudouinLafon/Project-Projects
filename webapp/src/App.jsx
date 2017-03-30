import React from 'react';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            projects: []
        }

        this.handleChange = this.handleChange.bind(this);
        this.updateFromDB = this.updateFromDB.bind(this);
    }

    updateFromDB(json) {
        this.setState({
            projects: json
        });
    }

    componentDidMount() {
        const updateFromDB = this.updateFromDB; 

        fetch('/api/*')
        .then(function(response) {
            response.json().then(function(json) {
                updateFromDB(json)
            })
        })
    }

    handleChange(event) {
        var current_projects = this.state.projects;
        var new_query = event.target.value;

        this.setState({
            projects: current_projects,
            query: new_query
        })
    }

    handleSubmit(event) {
        // Make actual request here
        if (isNaN(this.state.query) && PROJECTS[this.state.query]) {
            console.log('Should be doing something here')
            this.setState({projects: PROJECTS[this.state.query]})
        }
    }

    render() {
        let grid = null;
        console.log("Rendering projects:")
        console.log(this.state.projects)
        if (this.state.projects !== []) {
            grid = <ProjectGrid projectList={this.state.projects} />
        } else {
            grid = <div>No projects here!</div> 
        }
        return (
            <div>
                <div>
                    <center><h1>Project: Projects (U/C)</h1>
                    <h2>Students and Professors Side</h2></center>
                </div>
                {grid}
            </div>
        );
    }
}

class FilterSide extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <form>
                <input 
                    type="text"
                    placeholder={this.props.placeholder}
                    value={this.props.projectFilterValue}
                    onChange={this.handleProjectFilterText}
            />
            </form>
        );  
    }
}

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleFilterText = this.handleFilterText.bind(this);
    }

    handleFilterText(e) {
        this.props.handleFilterInputTextChange(e);
    }

    render() {
        return (
            <input 
                    type="text"
                    placeholder={this.props.placeholder}
                    value={this.props.filterValue}
                    onChange={this.handleFilterText}
            />
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
