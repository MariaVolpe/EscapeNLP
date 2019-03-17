import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './Home';
import Play from './Play';
import Lobby from './Lobby';
import Browser from './Browser';
import '../styles/App.css';

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
