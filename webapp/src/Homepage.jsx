import React from 'react';

export default class Homepage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            projects: [],
            query: "*"
        }

        this.updateFromDB = this.updateFromDB.bind(this);
    }

    updateFromDB(json) {
        this.setState({
            projects: json,
            query: this.state.query
        });
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

    render() {
        let slides = null;
        if (this.state.projects.length !== 0) {
            // console.log("****Rendering projects:")
            // console.log(this.state.projects)

            slides = <ProjectDisplay projectList={this.state.projects} />
        } else {
            slides = <div>No projects here!</div> 
        }
        return (
            <div>
                <div>
                    <center><h1>Project: Projects (U/C)</h1>
                    <h2>Public Side</h2></center>
                </div>
                {slides}
                <ProjectDisplay projectList = {this.state.projects} />
            </div>
        );
    }
}

class ProjectDisplay extends React.Component {
    render() {
        return (
            <div className = "projectDisplay">
                <div className="slideshow-container">
                    <Slide className="slide" projectList={this.props.projectList} />
                    {var slideIndex = 0}
                    {showProjects();}
                </div>
            </div>
        );
    }
}


class Slide extends React.Component {
    render() {
        var slides = [];
        this.props.projectList.forEach(function(project) {
            slides.push(<ProjectItem className="project-item" project={project} key={project._id} />)
        });
        console.log(slides);
        return (
            <div className="slideshow">
                {slides}
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
            <div class="mySlides fade">
                <div className="project-item">
                    <ProjectName className="project-name" name={name} />
                    <AuthorList className="project-authors" authorList={authorList} />
                    <Description className="project-description" description={description} />
                </div>
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

function showProjects() {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none"; 
    }
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1
    } 
    slides[slideIndex-1].style.display = "block"; 
    setTimeout(showProjects, 5000); // Change image every 5 seconds
}