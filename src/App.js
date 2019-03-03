import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './Home.js';
import Play from './Play.js';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <div className="App">
            <Route path ="/" exact render = {
              () => {
                return (<Home />);
              }
            }/>

            <Route path ="/play" exact render = {
              () => {
                return (<Play />);
              }
            }/>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
