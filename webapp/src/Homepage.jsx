import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router'

import slideshowScript from './slideshow.js'

import {plusSlides} from './slideshow.js'
import {minusSlides} from './slideshow.js'


/**
 * Homepage: creates the website's home page. It contains a slideshow and a fixed navigation bar, which contains authentication fields.
 */
export default class Homepage extends React.Component {

    // static styleguide = {
    //     index: '1.1',
    //     category: 'Elements',
    //     title: 'Button',
    //     description: 'You can use **Markdown** within this `description` field.'
    // }

    constructor(props) {
        super(props);

        this.state = {
            projects: [],
            query: "*"
        }

        this.updateFromDB = this.updateFromDB.bind(this);
    }

    /**
     * If the database is populated, this function populates the component's state with the projects in the database.
     */
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

/**
 * ProjectDisplay: Contains the main components of this class (slideshow and slide counter), wrapped in a div tag.
 */
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

/**
 * Slideshow: A slideshow of ProjectItems.
 */
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

/**
 * ProjectItem: Component that contains all of a given project's information: name, authorList, and description.
 */
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

/**
 * ProjectName: A given project's name.
 */
class ProjectName extends React.Component {
    render() {
        return (
            <div className="project-name"> {this.props.name} </div>
        );
    }
}

/**
 * Description: A given project's description component.
 */
class Description extends React.Component {
    render() {
        return (
            <div className="project-description"> {this.props.description} </div>
        );
    }
}

/**
 * AuthorList: List of a given project's authors' names component, in which names are joined by commas.
 */
class AuthorList extends React.Component {
    render() {
        return (
            <div className="project-authors">{this.props.authorList.join(', ')}</div>
        );
    }
}

/**
 * NavBar: Navigation bar component, which contains authentication fields (for usernames and passwords).
 */
class NavBar extends React.Component {
    render() {
        return (
            <div className="fixed-nav-bar">
                <nav class="fixed-nav-bar">
                <form method="POST">
                <input type="text" name="username" placeholder="Username"/> &emsp;
                <input type="password" name="password" placeholder="Password" /> &emsp;
                <Link to="/main"><input type="submit" value="&#10095; &emsp; &emsp;" /></Link>
                </form>
                </nav>
            </div>
        );
    }
}


/**
 * PrevButton: Backwards-facing arrow button component, which controls the slide that is displayed.
 */
class PrevButton extends React.Component {
    constructor() {
        super();
        this.onClick = this.handleClick.bind(this);
    }

    /**
     * If the button is clicked, the current slide index will be reduced by 1.
     */
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

/**
 * NextButton: Forwards-facing arrow button component, which controls the slide that is displayed.
 */
class NextButton extends React.Component {
    constructor() {
        super();
        this.onClick = this.handleClick.bind(this);
    }

    /**
     * If the button is clicked, the current slide index will be increased by 1.
     */
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