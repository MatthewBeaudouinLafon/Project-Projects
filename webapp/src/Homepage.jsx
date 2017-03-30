import React from 'react';

export default class Homepage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            projects: []
        }
        this.updateFromDB = this.updateFromDB.bind(this);
    }

    updateFromDB(json) {
        this.setState({
            projects: json
        });
    }

    componentDidMount() {
        const updateFromDB = this.updateFromDB; 
        fetch('/api/genetics')
        .then(function(response) {
            console.log("Response detected")
            response.json().then(function(json) {
                updateFromDB(json)
            })
        })
    }

    render() {
        return (
            <div>
                <div>
                    <center><h1>Project: Projects (U/C)</h1>
                    <h2>Public Side</h2></center>
                </div>
                <div>
                    <ProjectDisplay projectList={this.state.projects} />
                    {console.log("Trying to display projects")}
                </div>
            </div>
        );
    }
}

class ProjectDisplay extends React.Component {
    render() {
        return (
            <div className = "projectDisplay">
                <div class="slideshow-container">
                    <Slide className="slide" projectList={this.state.projects} />
                //     <a class="prev" onclick="plusSlides(-1)">&#10094;</a>
                //     <a class="next" onclick="plusSlides(1)">&#10095;</a>
                    var slideIndex = 0;
                    showProjects();
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
        return (
            <div>
                <div className="slideshow">
                    {slides}
                </div>
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
    // var i;
    var slides = document.getElementsByClassName("mySlides");
    for (var i = 0; i < slides.length; i++) {
        slides[i].style.display = "none"; 
    }
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1
    } 
    slides[slideIndex-1].style.display = "block"; 
    setTimeout(showProjects, 5000); // Change image every 5 seconds
}