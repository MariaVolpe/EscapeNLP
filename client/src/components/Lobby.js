import React, { Component } from 'react';
import { Button } from 'reactstrap';
import '../styles/Lobby.css';

class Lobby extends Component {

  onStartClick = (event) => {
    console.log('Started the game!');
    window.location.replace('/play');
  }

  render() {
    return (
      <div>
        <Button onClick={this.onStartClick}>Start Game</Button>
      </div>
    );
  }
}

export default Lobby;
