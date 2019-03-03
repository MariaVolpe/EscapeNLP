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
        <div>
        <Button color="danger" className='login-button'>Log-in</Button>
        <Button onClick={this.onPlayClick} color='danger' className='play-button'>Play Game</Button>
        <Button color='danger' className='signup-button'>Sign-up</Button>
        <a className='home-logo'>NLP</a>
        </div>
        Put some NLP example here
      </div>
    )
  }
}

export default Home;
