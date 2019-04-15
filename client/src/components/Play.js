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
      playerOneInfo: {
        name: '',
        inventory: {
          key: 'doorKey',
          weapon: 'sword',
        },
        picture: '[pic]',
        ready: false
      },
      playerTwoInfo: {
        name: '',
        inventory: {
          key: 'doorKey',
          weapon: 'sword',
        },
        picture: '[pic]',
        ready: false
      },
      playerThreeInfo: {
        name: '',
        inventory: {
          key: 'doorKey',
          weapon: 'sword',
        },
        picture: '[pic]',
        ready: false
      },
      playerFourInfo: {
        name: '',
        inventory: {
          key: 'doorKey',
          weapon: 'sword',
        },
        picture: '[pic]',
        ready: false
      },
      playerFiveInfo: {
        name: '',
        inventory: {
          key: 'doorKey',
          weapon: 'sword',
        },
        picture: '[pic]',
        ready: false
      },
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
      let playerOneInfo = this.state.playerOneInfo;
      let playerTwoInfo = this.state.playerTwoInfo;
      let playerThreeInfo = this.state.playerThreeInfo;
      let playerFourInfo = this.state.playerFourInfo;
      let playerFiveInfo = this.state.playerFiveInfo;

      if (players[0] !== undefined) {
        playerOneInfo['name'] = players[0][0];
        playerOneInfo['ready'] = players[0][1];
      }
      if (players[1] !== undefined) {
        playerTwoInfo['name'] = players[1][0];
        playerTwoInfo['ready'] = players[1][1];
      }
      if (players[2] !== undefined) {
        playerThreeInfo['name'] = players[2][0];
        playerThreeInfo['ready'] = players[2][1];
      }
      if (players[3] !== undefined) {
        playerFourInfo['name'] = players[3][0];
        playerFourInfo['ready'] = players[3][1];
      }
      if (players[4] !== undefined) {
        playerFiveInfo['name'] = players[4][0];
        playerFiveInfo['ready'] = players[4][1];
      }
      let allPlayersReady = playerOneInfo.ready && playerTwoInfo.ready && playerThreeInfo.ready && playerFourInfo.ready && playerFiveInfo.ready;

      this.setState({playerOneInfo, playerTwoInfo, playerThreeInfo, playerFourInfo, playerFiveInfo, allPlayersReady});
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

  onNameSubmit = (event) => {
    let playerName = this.state.playerName;
    while(playerName[0] === ' ') {
      playerName = playerName.slice(1);
      this.setState({playerName});
    }
    while(playerName[playerName.length - 1] === ' ') {
      playerName = playerName.slice(0, playerName.length - 1);
      this.setState({playerName});
    }
    let takenName = playerName === this.state.playerOneInfo.name || playerName === this.state.playerTwoInfo.name || playerName === this.state.playerThreeInfo.name || playerName === this.state.playerFourInfo.name;
    if (playerName.length > 2 && playerName.length <= 20 && !takenName) {
      // let playerFiveInfo = this.state.playerFiveInfo;
      // playerFiveInfo["name"] = playerName;
      //let allPlayers = this.state.allPlayers;
      //allPlayers.push(<PlayerInfo playerInfo={this.state.playerInfo} style={"player-box2"} />);
      this.socket.emit('getName', [playerName, false]);
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
    const allPlayers = [];
    allPlayers.push(<PlayerInfo playerInfo={this.state.playerOneInfo} style={"player-box"} className="row" />);
    //allPlayers.push(<div className="list"/>);
    allPlayers.push(<PlayerInfo playerInfo={this.state.playerTwoInfo} style={"player-box2"} className="row" />);
    //allPlayers.push(<div className="list"/>);
    allPlayers.push(<PlayerInfo playerInfo={this.state.playerThreeInfo} style={"player-box"} className="row" />);
    //allPlayers.push(<div className="list"/>);
    allPlayers.push(<PlayerInfo playerInfo={this.state.playerFourInfo} style={"player-box2"} className="row" />);
    //allPlayers.push(<div className="list"/>);
    if (this.state.allPlayersReady) {
      allPlayers.push(<PlayerInfo playerInfo={this.state.playerFiveInfo} style={"player-box"} className="row" />);
    }
    else {
      allPlayers.push(<PlayerInfo playerInfo={this.state.playerFiveInfo} style={"player-box"} className="row" />);
    }

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
