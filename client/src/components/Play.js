import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import socketIOClient from 'socket.io-client';
import MultiButton from './MultiButton';
import CreateNameModal from './CreateNameModal';
import PlayerInfo from './PlayerInfo';
import GameInfo from './GameInfo';
import TextInfo from './TextInfo';
import Navigation from './Navigation';
import '../styles/Play.css';

class Play extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allPlayers: {},
      board: [],
      gameComplete: false,
      message: '',
      prevMessages: [],
      command: '',
      commandDisabled: false,
      allPlayersReady: false,
      setName: false,
      playerName: '',
      chatOption: 'chat',
      warningOpen: false,
      numberOfPlayers: 0
    }

    this.socket = socketIOClient('');

    this.socket.on('chatMessage', (mess) => {
      let prevMessages = this.state.prevMessages;
      prevMessages.push(mess);
      this.setState({ message: '', command: '', prevMessages });
    });

    this.socket.on('setNames', (players) => {
      let allPlayers = this.state.allPlayers;

      players.forEach((player) => {
        if (!allPlayers.hasOwnProperty(player.name)) {
          allPlayers[player.name] = {
            inventory: {'slot1': ' ', 'slot2': ' ', 'slot3': ' ', 'slot4': ' ', 'slot5': ' ', 'slot6': ' ', 'slot7': ' ', 'slot8': ' '},
            ready: player.ready,
            position: player.position,
            leftGame: player.leftGame
          };
        }
      });

      this.setState({allPlayers});
    });

    this.socket.on('readyUp', (playerInfo, allPlayersReady) => {
      let allPlayers = this.state.allPlayers;
      if (allPlayers.hasOwnProperty(playerInfo.name)) {
        allPlayers[playerInfo.name].ready = playerInfo.ready;
      }

      if (allPlayersReady) {
        this.socket.emit('updateGame', this.state.board);
      }

      this.setState({allPlayers, allPlayersReady});
    });

    this.socket.on('removePlayer', (playerName) => {
      let allPlayers = this.state.allPlayers;
      if (allPlayers.hasOwnProperty(playerName)) {
        delete allPlayers[playerName];
      }

      this.setState({allPlayers});
    });

    this.socket.on('playerIsJoining', (numberOfPlayers) => {
      this.setState({numberOfPlayers});
    })

    this.socket.on('updateGame', (board, gameComplete) => {
      this.setState({board, gameComplete});
    });

    this.socket.on('updateInventories', (inventories) => {
      let allPlayers = this.state.allPlayers;
      Object.keys(inventories).forEach((player) => {
        if (allPlayers.hasOwnProperty(player)) {
          allPlayers.inventory = player.inventory;
        }
      });
      this.setState({allPlayers});
    });

    this.onMessageKeyPress = this.onMessageKeyPress.bind(this);
    this.onMessageChange = this.onMessageChange.bind(this);
    this.onCommandKeyPress = this.onCommandKeyPress.bind(this);
    this.onCommandChange = this.onCommandChange.bind(this);
    this.readyUp = this.readyUp.bind(this);
  }

  componentDidMount = () => {
    if (window.sessionStorage.getItem('roomId') !== null) {
      console.log(window.sessionStorage.getItem("roomId"));
      this.socket.emit('joinRoom', window.sessionStorage.getItem('roomId'));
      window.sessionStorage.removeItem("roomId")
      this.socket.emit('getName', '');
      const board = new Array(13).fill(null).map(() => new Array(16).fill(null).map(() => new Array(2).fill('floor')));
      this.setState({board});
    } else {
      console.log(window.sessionStorage.getItem("roomId"));
      window.location.replace('/browser');
    }
  }

  removeStartAndEndSpaces = (value) => {
    let words = value;
    while(words[0] === ' ') {
      words = words.slice(1);
    }
    while(words[words.length - 1] === ' ') {
      words = words.slice(0, words.length - 1);
    }
    return words;
  }

  createComment = (mess, type) => {
    let commenter = this.state.playerName;
    let date = new Date();
    let time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    const message = { commenter, time, mess, type };
    this.socket.emit('chatMessage', message);
  }

  onMessageKeyPress = (event) => {
    let message = event.target.value;
    message = this.removeStartAndEndSpaces(message);
    if (event.key === 'Enter' && message.length > 0) {
      if (message[0] === '*' && !this.state.gameComplete && !this.state.commandDisabled && this.state.allPlayersReady) {
        message = message.slice(1);
        this.createComment(message, 'action');
        this.setState({commandDisabled: true});
        setTimeout(() => {
          this.setState({commandDisabled: false});
        }, 2000);
      } else {
        this.createComment(message, 'chat');
      }
    }
    else if (message.length === 0) {
      this.setState({message: ''});
    }
    else if (event.key === ' ') {
      if (message[0] === '*' && message.length === 1) {
        this.setState({chatOption: 'action', message: '', command: ''});
      }
    }
  }

  onMessageChange = (event) => {
    const message = event.target.value;
    if (message.length <= 30) {
      this.setState({ message });
    }
  }

  onCommandKeyPress = (event) => {
    let command = event.target.value;
    command = this.removeStartAndEndSpaces(command);
    if (event.key === 'Enter' && command.length > 0) {
      this.createComment(command, 'action');
      this.setState({commandDisabled: true});
      setTimeout(() => {
        this.setState({commandDisabled: false});
      }, 2000);
    }
    else if (command.length === 0) {
      this.setState({command});
    }
    else if (event.key === ' ') {
      if (command[0] === '*' && command.length === 1) {
        this.setState({chatOption: 'chat', message: '', command: ''});
      }
    }
  }

  onCommandChange = (event) => {
    const command = event.target.value;
    if (command.length <= 30) {
      this.setState({ command });
    }
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
    playerName = this.removeStartAndEndSpaces(playerName);
    this.setState({ playerName });
    const takenName = allPlayers.hasOwnProperty(playerName);
    if (playerName.length > 2 && playerName.length <= 20 && !takenName) {
      const playerInfo = { name: playerName, ready: false, position: 0 };
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
    const chatOption = this.state.chatOption;
    if (chatOption === 'chat') {
      this.setState({chatOption: 'action', message: '', command: ''});
    } else {
      this.setState({chatOption: 'chat', message: '', command: ''});
    }
  }

  onWarningClose = (event) => {
    this.setState({warningOpen: !this.state.warningOpen});
  }

  onMessageClick = (i) => {
    let prevMessages = this.state.prevMessages;
    console.log(`Report ${prevMessages[i].mess} written by ${prevMessages[i].commenter}`);
  }

  render() {
    const map = new Array(13).fill(0).map(() => new Array(16).fill(0));
    const board = this.state.board;
    let allPlayers = [];
    Object.keys(this.state.allPlayers).forEach((player, i) => {
      let playerInfo = { name: player,
                         inventory: this.state.allPlayers[player].inventory,
                         ready: this.state.allPlayers[player].ready,
                         position: this.state.allPlayers[player].position,
                         leftGame: this.state.allPlayers[player].leftGame
                       };
      allPlayers.push(<PlayerInfo playerInfo={playerInfo} allPlayersReady={this.state.allPlayersReady} key={i} className="row player-box" />);
    });

    let gameInfo = <div/>;
    let playerInfo;
    if (this.state.allPlayersReady) {
      gameInfo = <div className='game-info'>
                    <GameInfo map={map} board={board} allPlayersReady={this.state.allPlayersReady} />
                  </div>;
      playerInfo = <div className='player-info'>
                      <div className="ui list">{allPlayers}</div>
                      <MultiButton type="abandon-button"/>
                   </div>;
    }
    else {
      gameInfo = <div className='game-info'>
                    <GameInfo map={map} board={board} allPlayersReady={this.state.allPlayersReady} />
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
        <Navigation inGame={true} />
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
            commandDisabled={this.state.commandDisabled}
            gameComplete={this.state.gameComplete}
            gameStart={this.state.allPlayersReady}
            onMessageClick={this.onMessageClick}
          />
        </div>
      </div>
    )
  }
}

export default Play;
