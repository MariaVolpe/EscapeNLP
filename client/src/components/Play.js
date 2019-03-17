import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import MultiButton from './MultiButton.js';
import AbandonButton from './AbandonButton';
import PlayerInfo from './PlayerInfo';
import GameInfo from './GameInfo';
import Commands from './Commands';
import TextInfo from './TextInfo';
import '../styles/Play.css';

class Play extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerInfo: {
        name: 'Nicky Cen',
        inventory: {
          key: 'doorKey',
          weapon: 'sword'
        },
        picture: '[pic]'
      },
      map: [],
      message: '',
      prevMessages: [],
<<<<<<< HEAD
      command: '',
    };
=======
      command: "",
      allPlayersReady: false
    }
>>>>>>> 83d17f1171cc007d8501ff49014c5236329427f5

    this.onMessageKeyPress = this.onMessageKeyPress.bind(this);
    this.onMessageChange = this.onMessageChange.bind(this);
    this.onCommandKeyPress = this.onCommandKeyPress.bind(this);
    this.onCommandChange = this.onCommandChange.bind(this);
<<<<<<< HEAD
=======
    this.readyUp = this.readyUp.bind(this);
>>>>>>> 83d17f1171cc007d8501ff49014c5236329427f5
  }

  onMessageKeyPress = event => {
    if (event.key === 'Enter') {
      const message = 'You said: `' + event.target.value + '`';
      let prevMessages = this.state.prevMessages;
      prevMessages.push(message);
      this.setState({ message: '', prevMessages });
    }
  };

  onMessageChange = event => {
    const message = event.target.value;
    if (message.length <= 50) {
      this.setState({ message });
    }
  }

  onCommandKeyPress = event => {
    if (event.key === 'Enter' && event.target.value.length > 0) {
      const message = 'You wanted to: `' + event.target.value + '`';
      let prevMessages = this.state.prevMessages;
      prevMessages.push(message);
      this.setState({ command: '', prevMessages });
    }
  };

  onCommandChange = event => {
    const command = event.target.value;
    this.setState({ command });
  };

  readyUp = (event) => {
    this.setState({allPlayersReady: !this.state.allPlayersReady});
  }

  render() {
    const map = new Array(12).fill(0).map(() => new Array(12).fill(0));
    let players = [];
    let evenOrOdd = '';

<<<<<<< HEAD
    for (let i = 0; i < 5; i++) {
      if (i % 2 === 1) {
        evenOrOdd = '2';
      } else {
        evenOrOdd = '';
=======
    for (let i=0; i<5; i++) {
      if (i%2 === 1) {
        evenOrOdd = "2";
      }
      else {
        evenOrOdd = "";
>>>>>>> 83d17f1171cc007d8501ff49014c5236329427f5
      }
      players.push(
        <PlayerInfo
          playerInfo={this.state.playerInfo}
          style={"player-box" + evenOrOdd}
        />
      );
    }

<<<<<<< HEAD
    return (
      <div className="play-page">
        <div className="player-info">
          Player Info
          {players}
          <AbandonButton />
        </div>
        <div className="game-info">
          map view
          <GameInfo map={map} />
          <Commands
            command={this.state.command}
            onKeyPress={this.onCommandKeyPress}
            onChange={this.onCommandChange}
          />
        </div>
        <div className="text-info">
=======
    let gameInfo;
    let playerInfo;
    if (this.state.allPlayersReady) {
      gameInfo = <div className='game-info'>
                    map view
                    <GameInfo map={map} allPlayersReady={this.state.allPlayersReady} />
                    <Commands command={this.state.command} onKeyPress={this.onCommandKeyPress} onChange={this.onCommandChange} />
                  </div>;
      playerInfo = <div className='player-info'>
                      Player Info
                      {players}
                      <MultiButton type="abandon-button"/>
                   </div>;
    }
    else {
      gameInfo = <div className='game-info'>
                    map view
                    <GameInfo map={map} allPlayersReady={this.state.allPlayersReady} />
                  </div>;
      playerInfo = <div className='player-info'>
                    Player Info
                    {players}
                    <Row>
                      <Col>
                        <MultiButton type="leave-button"/>
                      </Col>
                      <Col>
                        <MultiButton type="ready-button" readyUp={this.readyUp}/>
                      </Col>
                    </Row>
                  </div>;
    }

    return(
      <div className="play-page" >
        {playerInfo}
        {gameInfo}
        <div className='text-info'>
>>>>>>> 83d17f1171cc007d8501ff49014c5236329427f5
          text and stuff
          <TextInfo
            message={this.state.message}
            prevMessages={this.state.prevMessages}
            onKeyPress={this.onMessageKeyPress}
            onChange={this.onMessageChange}
          />
        </div>
      </div>
    );
  }
}

export default Play;
