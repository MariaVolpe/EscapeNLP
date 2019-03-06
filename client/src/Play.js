import React, { Component } from 'react';
import { Button } from 'reactstrap';
import AbandonButton from './AbandonButton.js';
import PlayerInfo from './PlayerInfo.js';
import GameInfo from './GameInfo.js';
import Commands from './Commands.js';
import TextInfo from './TextInfo.js';
import './Play.css';

class Play extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerInfo: {
        name: "Nicky Cen",
        inventory: {
          key: "doorKey",
          weapon: "sword"
        },
        picture: "[pic]"
      },
      map: [],
      message: "",
      prevMessages: [],
      command: ""
    }

    this.onMessageKeyPress = this.onMessageKeyPress.bind(this);
    this.onMessageChange = this.onMessageChange.bind(this);
    this.onCommandKeyPress = this.onCommandKeyPress.bind(this);
    this.onCommandChange = this.onCommandChange.bind(this);

  }

  onMessageKeyPress = (event) => {
    if (event.key === 'Enter') {
      const message = event.target.value;
      let prevMessages = this.state.prevMessages;
      prevMessages.push(message);
      this.setState({message: '', prevMessages});
    }
  }

  onMessageChange = (event) => {
    const message = event.target.value;
    this.setState({message});
  }

  onCommandKeyPress = (event) => {
    if (event.key === 'Enter') {
      const message = "You wanted to: `" + event.target.value + "`";
      let prevMessages = this.state.prevMessages;
      prevMessages.push(message);
      this.setState({command: '', prevMessages});
    }
  }

  onCommandChange = (event) => {
    const command = event.target.value;
    this.setState({command});
  }

  render() {
    const map = new Array(12).fill(0).map(() => new Array(12).fill(0));

    return(
      <div className="play-page" >
        <div className='player-info'>
          Player Info
          <PlayerInfo playerInfo={this.state.playerInfo} />
          <AbandonButton/>
        </div>
        <div className='game-info'>
          map view
          <GameInfo map={map}/>
          <Commands command={this.state.command} onKeyPress={this.onCommandKeyPress} onChange={this.onCommandChange} />
        </div>
        <div className='text-info'>
          text and stuff
          <TextInfo message={this.state.message} prevMessages={this.state.prevMessages} onKeyPress={this.onMessageKeyPress} onChange={this.onMessageChange}/>
        </div>
      </div>
    )
  }
}

export default Play;
