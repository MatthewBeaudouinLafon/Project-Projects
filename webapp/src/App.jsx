import React from 'react';


export default class App extends React.Component {
    render() {
        return (
            // <div className="app">Hello, nice people! Don't be wrong</div>
            <div className="project-item">
                <div className="project-name"> Header </div>
                <div>
                    <AuthorList className="project-authors" authorList={authorList}/>
                    <Description className="project-description" description={description} />
                </div>
            </div>

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

class Author extends React.Component {
    render() {
        return (
            <li>{this.props.author}</li>
        );
    }
}

class AuthorList extends React.Component {


    render() {
        var authors = [];
        this.props.authorList.forEach(function(author) {
            authors.push(<Author author={author} key={author} />)    
        });
        return (
            <ul>
                {authors}
            </ul>
        );
    }
}


class ____ extends React.Component {
    render() {
        return (
            
        );
    }
}
