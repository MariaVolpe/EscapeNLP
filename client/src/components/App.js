import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
<<<<<<< HEAD:client/src/App.js
import Home from './Home.js';
import Play from './Play.js';
import Browser from './Browser.js';
import './App.css';
=======
import Home from './Home';
import Play from './Play';
import Lobby from './Lobby';
import Browser from './Browser';
import '../styles/App.css';
>>>>>>> d5483488e454366dc1bbd43eeb8b4966562f39ea:client/src/components/App.js

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

            <Route path ="/browser" exact render = {
              () => {
                return (<Browser />);
              }
            }/>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
