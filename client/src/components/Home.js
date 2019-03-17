import React, { Component } from 'react';
import { Button } from 'reactstrap';
import '../styles/Home.css';

class Home extends Component {

  onPlayClick = (event) => {
    console.log('Play the game!');
    window.location.replace('/browser');
  }

  onLoginClick = (event) => {
    console.log('login button clicked');
  }

  onCreateClick = (event) => {
    console.log('Create a room');
    window.location.replace('/play');
  }

  render() {
    return(
      <div className='App-header'>
          <Button onClick={this.onPlayClick} color='danger' className='play-button'>Play Game</Button>
          <div className="center-buttons">
            <Button onClick={this.onLoginClick} color="danger" className='login-button'>Log-in</Button>
            <a className='home-logo'>EscapeNLP</a>
            <Button color='danger' className='signup-button'>Signup</Button>
          </div>
          <Button onClick={this.onCreateClick}>Create Lobby</Button>
      </div>
    )
  }
}

export default Home;
