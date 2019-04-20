import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import socketIOClient from 'socket.io-client';
import MultiButton from './MultiButton';
import CreateNameModal from './CreateNameModal';
import PlayerInfo from './PlayerInfo';
import GameInfo from './GameInfo';
import Commands from './Commands';
import TextInfo from './TextInfo';
import '../styles/Play.css';

class Play extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allPlayers: [{
        name: '',
        inventory: {
          key: 'doorKey',
          weapon: 'sword',
        },
        picture: '[pic]',
        ready: false
      },
      {
        name: '',
        inventory: {
          key: 'doorKey',
          weapon: 'sword',
        },
        picture: '[pic]',
        ready: false
      },
      {
        name: '',
        inventory: {
          key: 'doorKey',
          weapon: 'sword',
        },
        picture: '[pic]',
        ready: false
      },
      {
        name: '',
        inventory: {
          key: 'doorKey',
          weapon: 'sword',
        },
        picture: '[pic]',
        ready: false
      },
      {
        name: '',
        inventory: {
          key: 'doorKey',
          weapon: 'sword',
        },
        picture: '[pic]',
        ready: false
      }],
      map: [],
      message: '',
      prevMessages: [],
      command: '',
      allPlayersReady: false,
      setName: false,
      playerName: '',
      chatOption: '0',
      warningOpen: false
    }

    this.socket = socketIOClient('');

    this.socket.on('chatMessage', (mess) => {
      let prevMessages = this.state.prevMessages;
      prevMessages.push(mess);
      this.setState({ message: '', command: '', prevMessages });
    });

    this.socket.on('setNames', (players) => {
      const MAX_PLAYER_COUNT = 5;
      const length = players.length;
      let allPlayers = this.state.allPlayers;

      allPlayers.forEach((player, i) => {
        if (i < length) {
          player.name = players[i].name;
          player.ready = players[i].ready;
        } else {
          player.name = '';
          player.ready = false;
        }
      });

      const allReady = allPlayers.map((player, i) => (player.ready || (!player.ready && player.name === '' && i > 0)));

      let allPlayersReady = (allReady.indexOf(false) >= 0 ? false : true) || this.state.allPlayersReady;

      this.setState({allPlayers, allPlayersReady});
    });

    this.onMessageKeyPress = this.onMessageKeyPress.bind(this);
    this.onMessageChange = this.onMessageChange.bind(this);
    this.onCommandKeyPress = this.onCommandKeyPress.bind(this);
    this.onCommandChange = this.onCommandChange.bind(this);
    this.readyUp = this.readyUp.bind(this);
  }

  componentDidMount = () => {
    this.socket.emit('joinRoom', window.sessionStorage.getItem('roomId'));
    this.socket.emit('getName', '');
  }

  onMessageKeyPress = (event) => {
    if (event.key === 'Enter' && event.target.value.length > 0) {
      let commenter = this.state.playerName;
      let date = new Date();
      let time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
      let mess = event.target.value;
      const message = [commenter, time, mess];
      this.socket.emit('chatMessage', message);
    }
  }

  onMessageChange = (event) => {
    const message = event.target.value;
    if (message.length <= 43) {
      this.setState({ message });
    }
  }

  onCommandKeyPress = (event) => {
    if (event.key === 'Enter' && event.target.value.length > 0) {
      let commenter = this.state.playerName;
      let date = new Date();
      let time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
      let mess = 'You wanted to: ' + event.target.value;
      const message = [commenter, time, mess];
      this.socket.emit('chatMessage', message);
    }
  }

  onCommandChange = (event) => {
    const command = event.target.value;
    this.setState({ command });
  }

  readyUp = (event) => {
    this.socket.emit('readyToggle');
  }

  sameName = (playerInfo) => {
    return playerInfo.name === this.state.playerName;
  }

  onNameSubmit = (event) => {
    let playerName = this.state.playerName;
    let allPlayers = this.state.allPlayers;
    while(playerName[0] === ' ') {
      playerName = playerName.slice(1);
      this.setState({ playerName });
    }
    while(playerName[playerName.length - 1] === ' ') {
      playerName = playerName.slice(0, playerName.length - 1);
      this.setState({ playerName });
    }
    const takenName = allPlayers.some(this.sameName);
    if (playerName.length > 2 && playerName.length <= 20 && !takenName) {
      const playerInfo = { name: playerName, ready: false };
      this.socket.emit('getName', playerInfo);
      this.setState({setName: !this.state.setName});
    }
    else {
      this.setState({warningOpen: true});
    }
    event.preventDefault();
  }

  onNameChange = (event) => {
    const playerName = event.target.value;
    if (playerName.length < 25) {
      this.setState({playerName});
    }
  }

  onChatOptionChange = (event) => {
    const chatOption = event.target.value;
    this.setState({chatOption});
  }

  onWarningClose = (event) => {
    this.setState({warningOpen: !this.state.warningOpen});
  }

  render() {
    const map = new Array(12).fill(0).map(() => new Array(12).fill(0));
    const allPlayers = this.state.allPlayers.map(player => <PlayerInfo playerInfo={player} style={"player-box"} className="row" />);

    let gameInfo;
    let playerInfo;
    if (this.state.allPlayersReady) {
      gameInfo = <div className='game-info'>
                    <GameInfo map={map} allPlayersReady={this.state.allPlayersReady} />

                  </div>;
      playerInfo = <div className='player-info'>
                      <div className="ui list">{allPlayers}</div>
                      <MultiButton type="abandon-button"/>
                   </div>;
    }
    else {
      gameInfo = <div className='game-info'>
                    <GameInfo map={map} allPlayersReady={this.state.allPlayersReady} />
                  </div>;
      playerInfo = <div className='player-info'>
                    <div className="ui list">{allPlayers}</div>
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
        <h1 class="ui dividing header">EscapeNLP</h1>
        {playerInfo}
        {gameInfo}
        <CreateNameModal
          isOpen={!this.state.setName}
          handleSubmit={this.onNameSubmit}
          value={this.state.playerName}
          onNameChange={this.onNameChange}
          warningOpen={this.state.warningOpen}
          onWarningClose={this.onWarningClose}
        />
        <div className='text-info'>
          <TextInfo
            message={this.state.message}
            prevMessages={this.state.prevMessages}
            onKeyPress={this.onMessageKeyPress}
            onChange={this.onMessageChange}
            currPlayer={this.state.playerName}
            chatOption={this.state.chatOption}
            onChatOptionChange={this.onChatOptionChange}
            command={this.state.command}
            onCommandKeyPress={this.onCommandKeyPress}
            onCommandChange={this.onCommandChange}
          />
        </div>
      </div>
    )
  }
}

export default Play;
