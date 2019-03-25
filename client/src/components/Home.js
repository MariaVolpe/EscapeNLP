import React, { Component } from 'react';
import { Button } from 'reactstrap';
import CreateLobbyModal from './CreateLobbyModal';
import '../styles/Home.css';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      createLobbyIsOpen: false
    }

    this.onPlayClick = this.onPlayClick.bind(this);
    this.onLoginClick = this.onLoginClick.bind(this);
    this.onCreateClick = this.onCreateClick.bind(this);
    this.onHowToClick = this.onHowToClick.bind(this);
    this.handleCreateSubmit = this.handleCreateSubmit.bind(this);
  }

  onPlayClick = (event) => {
    console.log('Play the game!');
    window.location.replace('/browser');
  }

  onLoginClick = (event) => {
    console.log('login button clicked');
  }

  onCreateClick = (event) => {
    console.log('Create a room');
    this.setState({createLobbyIsOpen: !this.state.createLobbyIsOpen});
    event.preventDefault();
    //window.location.replace('/play');
  }

  onHowToClick = (event) => {
    console.log('How To');
    window.location.replace('/howto');
  }
  
  handleCreateSubmit = (event) => {
    window.location.replace('/play');
    event.preventDefault();
  }

  render() {
    return <div className="App-header">
        <Button
          onClick={this.onPlayClick}
          color="danger"
          className="play-button"
        >
          Find Game
        </Button>
        <div className="center-buttons">
          <Button
            onClick={this.onLoginClick}
            color="danger"
            className="login-button"
          >
            Log-in
          </Button>
          <a className="home-logo">EscapeNLP</a>
          <Button 
            onClick={this.onHowToClick}
            color="danger" 
            className="signup-button"
          >
            How To
          </Button>
        </div>
        <CreateLobbyModal isOpen={this.state.createLobbyIsOpen} onToggle={this.onCreateClick} handleSubmit={this.handleCreateSubmit}/>
        <Button onClick={this.onCreateClick}>Create Lobby</Button>
      </div>;
  }
}

export default Home;
