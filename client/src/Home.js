import React, { Component } from 'react';
import { Button } from 'reactstrap';
import './Home.css';

class Home extends Component {

  onPlayClick = (event) => {
    console.log('Play the game!');
    window.location.replace('/play');
  }

  onLoginClick = (event) => {
    console.log('login button clicked');
  }

  onCreateClick = (event) => {
    console.log('Create a room');
    window.location.replace('/lobby');
  }

  render() {
    return(
      <div className='App-header'>
          <Button onClick={this.onPlayClick} color='danger' className='play-button'>Play Game</Button>
          <div className="center-buttons">
            <a onClick={this.onLoginClick} color="danger" className='login-button'>Log-in</a>
            <a className='home-logo'>EscapeNLP</a>
            <a color='danger' className='signup-button'>Signup</a>
          </div>
          <Button onClick={this.onCreateClick}>Create Lobby</Button>
      </div>
    )
  }
}

export default Home;
