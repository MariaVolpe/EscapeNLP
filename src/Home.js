import React, { Component } from 'react';
import { Button } from 'reactstrap';
import './Home.css';

class Home extends Component {

  onPlayClick = (event) => {
    console.log('Play the game!');
    window.location.replace('/play');
  }

  render() {
    return(
      <div className='App-header'>
          <Button onClick={this.onPlayClick} color='danger' className='play-button'>Play Game</Button>
          <div>
            <a color="danger" className='login-button'>Log-in</a>
            <a className='home-logo'>EscapeNLP</a>
            <a color='danger' className='signup-button'>Sign-up</a>
          </div>
      </div>
    )
  }
}

export default Home;
