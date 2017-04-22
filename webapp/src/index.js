import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import './style.scss';
import './Draft.scss';
import Homepage from './Homepage';
import ProjectForm from './ProjectForm';

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

// ReactDOM.render(
//   <ProjectList projects={projects} />,
//   document.getElementById('root')
// );

// var DB_PROJECTS = []
// fetch('/api/genetics')
// .then(function(response) {
//     console.log("Sample project:")
//     // console.log(response.json());
//     response.json().then(function(json) {
//         console.log(json)
//         DB_PROJECTS = json;
//     })
// })

ReactDOM.render(
  <App  />,
  document.getElementById('root')
);

