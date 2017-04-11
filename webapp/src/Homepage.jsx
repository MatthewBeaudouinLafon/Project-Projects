import React from 'react';
import ReactDOM from 'react-dom';

import slideshowScript from './slideshow.js'

import {plusSlides} from './slideshow.js'
import {minusSlides} from './slideshow.js'

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

    componentWillMount() {
        const script = document.createElement( 'script' );
            script.type = 'text/javascript';
            script.src = slideshowScript;
            script.async = true;
            document.body.appendChild(script);
            // $('.script-placeholder').append(embedCode);
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
                <NavBar />
                <div><br/><br/><br/>
                    <center><h1>Project: Projects (U/C)</h1>
                    <h2>Public Side</h2></center>
                </div>
                {slides}
            </div>
        );
    }
}

class ProjectDisplay extends React.Component {
    render() {
        return (
            <div className = "projectDisplay">
                <div className="slideshow-container">
                    <Slideshow className="slide" projectList={this.props.projectList} />
                    <PrevButton />
                    <NextButton />
                </div><br/><br/><br/>
                <center><div id="slide-counter"></div></center>
            </div>
        );
    }
}


class Slideshow extends React.Component {
    render() {
        var slides = [];
        this.props.projectList.forEach(function(project) {
            slides.push(<ProjectItem className="project-item" project={project} key={project._id} />)
        });
        console.log(slides);
        return (
            <div>
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
            <div className="mySlides fade">
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

class NavBar extends React.Component {
    render() {
        return (
            <div className="fixed-nav-bar">
                <nav class="fixed-nav-bar">
                <form method="POST">
                <input type="text" name="username" placeholder="Username"/> &emsp;
                <input type="text" name="password" placeholder="Password" /> &emsp;
                <input type="submit" value="&#10095;" />
                </form>
                 &emsp;
                <a href="">Forgot your password?</a> &emsp;
                </nav>
            </div>
        );
    }
}

class PrevButton extends React.Component {
    constructor() {
        super();
        this.onClick = this.handleClick.bind(this);
    }

    handleClick (event) {
        minusSlides(1);
    }

    render() {
        return (
            <a className="prev" onClick={this.onClick}>
                &#10094;
            </a>
        );
    }
}

class NextButton extends React.Component {
    constructor() {
        super();
        this.onClick = this.handleClick.bind(this);
    }

    handleClick (event) {
        plusSlides(1);
    }

    render() {
        return (
            <a className="next" onClick={this.onClick}>
                &#10095;
            </a>
        );
    }
}