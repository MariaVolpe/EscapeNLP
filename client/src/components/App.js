import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import Home from './Home';
import Play from './Play';
import Browser from './Browser';
import HowTo from './HowTo';
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

            <Route path="/howto" exact render = {
              () => {
                return (<HowTo />);
              }
            }/>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
