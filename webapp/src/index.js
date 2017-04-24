import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import './style.scss';
import './Draft.scss';
import Homepage from './Homepage';
import ProjectForm from './ProjectForm';
import { HashRouter as Router } from 'react-router-dom';
import {  Route,
          Link,
          IndexRoute,
          hashHistory,
          browserHistory } from 'react-router';


ReactDOM.render((
  <Router>
    <div>
      <Route exact path="/" component={Homepage} />
      <Route exact path="/main" component={App} />
      <Route path="/main/*" component={ProjectForm} />
    </div>
  </Router>
), document.getElementById('root'));

// ReactDOM.render(
//   <Homepage  />,
//   document.getElementById('root')
// );

