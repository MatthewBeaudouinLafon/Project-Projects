import React from 'react';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            allProjects: [],
            displayProjects: [],
            query: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.updateFromDB = this.updateFromDB.bind(this);
    }

    updateFromDB(json) {
        this.setState({
            allProjects: json,
            displayProjects: json,
            query: this.state.query
        });
    }

    componentDidMount() {
        const updateFromDB = this.updateFromDB; 

        fetch('/api/genetics')
        .then(function(response) {
            response.json().then(function(json) {
                updateFromDB(json)
            })
        })
    }

    handleChange(event) {
        const new_query = event.target.value;
        const regex = new RegExp(".*" + new_query + ".*")
        const current_projects = this.state.allProjects.filter(function(proj) {
            return (regex.test(proj.title))
        });

        this.setState({
            allProjects: this.state.allProjects,
            displayProjects: current_projects,
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
        console.log(this.state.displayProjects)
        if (this.state.displayProjects !== []) {
            grid = <ProjectGrid projectList={this.state.displayProjects} />
        } else {
            grid = <div>No projects here!</div> 
        }
        return (
            <div>
                <div>
                    <center><h1>Project: Projects (U/C)</h1>
                    <h2>Students and Professors Side</h2></center>
                    <input type="text" placeholder="Search..." value={this.state.query} onChange={this.handleChange} />
                </div>
                <ProjectGrid projectList={this.state.projects} />
            </div>
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