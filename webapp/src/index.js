import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './style.scss';



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
    description: "Math to win WWII."
  }
];

// ReactDOM.render(
//   <ProjectList projects={projects} />,
//   document.getElementById('root')
// );

ReactDOM.render(
  <App project={PROJECTS[0]}/>,
  document.getElementById('root')
);
