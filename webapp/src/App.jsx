import React from 'react';

var PROJECTS = [
  {
    name: "Project Projects", 
    id: "1", 
    students: ["Emily Yeh", "Matthew Beaudouin-Lafon"], 
    thumbnail: "http://i.imgur.com/RtC6c01.jpg", 
    description: "This is a project about helping projects getting the spotlight they deserve"
  },
  {
    name: "Breaking the Enigma Machine", 
    id: "2", 
    students: ["Alan Turing", "Bletchley Park"], 
    thumbnail: "http://static.bbc.co.uk/history/img/ic/640/images/resources/topics/enigma.jpg", 
    description: "Math to win WWII.  Turing played a pivotal role in cracking intercepted coded messages that enabled the Allies to defeat the Nazis in many crucial engagements, including the Battle of the Atlantic, and in so doing helped win the war."
  },
  {
    name: "National Tour",
    id: "3",
    students: ["Itzhak Perlman", "Emanuel Ax"],
    thumbnail: "https://www.noozhawk.com/images/uploads/nh_7_perlman_ax.jpg  (673KB) ",
    description: "Two of the world's most accomplished classical musicians and longtime friends Itzhak Perlman and Emanuel Ax did a national tour in 2016."
  },

  {
    name: "Puppy Celebration",
    id: "4",
    students: ["Barack Obama", "Michelle Obama", "Malia Obama", "Sasha Obama"],
    thumbnail: "",
    description: "Even though the Obamas are out of the White House, we can't help reminiscing about our favorite former first pooches, Bo and Sunny. Michelle Obama recently gave the world a glimpse of what Bo and Sunny are up to since leaving the White House -- and not surprisingly, they're as happy as ever."
  }
];

export default class App extends React.Component {
    constructor(props) {
        super(props);
        //Get all 
        this.state = {
            projects: PROJECTS,
            query: ''
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        var current_projects = this.state.projects;
        var new_query = event.target.value;

        if (new_query == '') {
            current_projects = PROJECTS;
        } else {
            current_projects = PROJECTS.filter(function(project) {
                return project.name.includes(new_query);
            })
        }
        // else if (!isNaN(new_query) && PROJECTS[new_query]) {
        //     console.log('Should be doing something here');
        //     current_projects = [PROJECTS[new_query]];
        // }

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
        //event.preventDefault();
    }


    render() {
        return (
            <div>
                <div>
                    <center><h1>Project: Projects (U/C)</h1>
                    <h2>Students and Professors Side</h2></center>
                    <form onSubmit={this.handleSubmit}>
                        <input type="text" value={this.state.query} onChange={this.handleChange} />
                    </form>
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
            projects.push(<ProjectItem className="project-item" project={project} key={project.id}/>)
        })
        return (
            <div className="project-grid">
                {projects}
            </div>
        );
    }
}

class ProjectItem extends React.Component {
    render() {
        var name = this.props.project.name;
        var authorList = this.props.project.students;
        var description = this.props.project.description;
        return (
            // <div className="app">Hello, nice people! Don't be wrong</div>
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
