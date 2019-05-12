import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import socketIOClient from 'socket.io-client';
import MultiButton from './MultiButton';
import CreateNameModal from './CreateNameModal';
import PlayerInfo from './PlayerInfo';
import GameInfo from './GameInfo';
import TextInfo from './TextInfo';
import Navigation from './Navigation';
import ReportModal from './ReportModal';
import '../styles/Play.css';

class Play extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allPlayers: [],
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
      numberOfPlayers: 0,
      timer: 0,
      reportOpen: false,
      reportedMessage: {},
      reportHover: false,
      reportIndex: 0
    }

    this.socket = socketIOClient('');

    this.socket.on('chatMessage', (mess) => {
      let prevMessages = this.state.prevMessages;
      prevMessages.push(mess);
      if (mess.mess === '/d20' && mess.commenter === this.state.playerName) {
        const d20 = mess.commenter + ' rolled a ' + Math.floor(Math.random() * Math.floor(21));
        const message = {
          type: 'chat',
          time: mess.time,
          commenter: 'System',
          mess: d20
        }
        this.socket.emit('chatMessage', message);
      }
      this.setState({ message: '', command: '', prevMessages });
    });

    this.socket.on('setNames', (allPlayers) => {
      // let allPlayers = this.state.allPlayers;
      //
      // players.forEach((player, i) => {
      //   if (!allPlayers.hasOwnProperty(player.name)) {
      //     allPlayers[player.name] = {
      //       inventory: [],
      //       ready: player.ready,
      //       position: player.position,
      //       hasLeftGame: player.hasLeftGame,
      //       iconName: player.iconName
      //     };
      //   } else {
      //     allPlayers[player.name].position = player.position;
      //     allPlayers[player.name].iconName = player.iconName;
      //   }
      // });
      this.setState({allPlayers});
    });

    this.socket.on('updatePlayers', (players) => {
      let allPlayers = this.state.allPlayers;
      for (let i=0; i<allPlayers.length; i++) {
        let name = allPlayers[i].name;
        if (players.hasOwnProperty(name)) {
          allPlayers[i].inventory = players[name].inventory;
          allPlayers[i].id = players[name].id;
        }
      }
      this.setState({allPlayers})
    });

    this.socket.on('readyUp', (playerInfo, allPlayersReady) => {
      let allPlayers = this.state.allPlayers;
      // if (allPlayers.hasOwnProperty(playerInfo.name)) {
      //   allPlayers[playerInfo.name].ready = playerInfo.ready;
      // }
      allPlayers.forEach((player) => {
        if (player.name === playerInfo.name) {
          player.ready = playerInfo.ready;
        }
      });

      if (allPlayersReady) {
        this.socket.emit('startGame', this.state.board);
      }

      this.setState({allPlayers, allPlayersReady});
    });

    this.socket.on('removePlayer', (playerName) => {
      let allPlayers = this.state.allPlayers;
      let removeIndex = 0;
      allPlayers.forEach((player, i) => {
        if (player.name === playerName) {
          removeIndex = i;
        }
      });
      allPlayers = allPlayers.slice(removeIndex);
      // if (allPlayers.hasOwnProperty(playerName)) {
      //   delete allPlayers[playerName];
      // }

      this.setState({allPlayers});
    });

    this.socket.on('playerIsJoining', (numberOfPlayers) => {
      this.setState({numberOfPlayers});
    })

    this.socket.on('updateBoard', (board, gameComplete) => {
      this.setState({ board, gameComplete });
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

    this.socket.on('updatePlayerCount', (playerList) => {

    });

    this.socket.on('updateTimer', (timer) => {
      this.setState({timer});
    })

    this.onMessageKeyPress = this.onMessageKeyPress.bind(this);
    this.onMessageChange = this.onMessageChange.bind(this);
    this.onCommandKeyPress = this.onCommandKeyPress.bind(this);
    this.onCommandChange = this.onCommandChange.bind(this);
    this.readyUp = this.readyUp.bind(this);
  }

  componentDidMount = () => {
    if (window.sessionStorage.getItem('roomId') !== null) {
      this.socket.emit('joinRoom', window.sessionStorage.getItem('roomId'));
      window.sessionStorage.removeItem("roomId");
      this.socket.emit('getName', '');
      const board = new Array(15).fill(null).map(() => new Array(12).fill(null).map(() => new Array(2).fill({sprite: '', hint: ''})));
      this.setState({board});
    } else {
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
    let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes().toString() : date.getMinutes().toString();
    let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds().toString() : date.getSeconds().toString();
    let time = date.getHours() + ':' + minutes + ':' + seconds;
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
    if (message.length <= 150) {
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
    if (command.length <= 100) {
      this.setState({ command });
    }
  }

  readyUp = (event) => {
    this.socket.emit('readyToggle');
  }

  sameName = (playerInfo) => {
    return playerInfo.name === this.state.playerName;
  }

  isAlphaNumeric = (name) => {
    for (let i=0; i<name.length; i++) {
      if (name[i].match(/^[a-z0-9]+$/i) === null) {
        return false;
      }
    }
    return true;
  }

  onNameSubmit = (event) => {
    let playerName = this.state.playerName;
    let allPlayers = this.state.allPlayers;
    playerName = this.removeStartAndEndSpaces(playerName);
    this.setState({ playerName });
    //const takenName = allPlayers.hasOwnProperty(playerName);
    let takenName = false;
    allPlayers.forEach((player) => {
      if (player.name === playerName) {
        takenName = true;
      }
    })
    if (playerName.length > 2 && !takenName && this.isAlphaNumeric(playerName)) {
      let playerIcon;
      if (window.sessionStorage.getItem('playerIcon') !== null) {
        playerIcon = window.sessionStorage.getItem('playerIcon');
      } else {
        playerIcon = 'defaultIcon';
      }
      const playerInfo = { name: playerName, ready: false, position: 0, iconName: playerIcon, playerId: window.sessionStorage.getItem('playerId') };
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
    if (playerName.length < 20) {
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
    const reportedMessage = prevMessages[i];
    console.log(`Report ${prevMessages[i].mess} written by ${prevMessages[i].commenter}`);
    this.setState({reportOpen: !this.state.reportOpen, reportedMessage});
  }

  onMessageHover = (index) => {
    this.setState({reportHover: true, reportIndex: index});
  }

  onMessageLeave = (index) => {
    this.setState({reportHover: false, reportIndex: -1});
  }

  onReportToggle = (event) => {
    this.setState({reportOpen: !this.state.reportOpen});
    event.preventDefault();
  }

  onInterpretedClick = (index) => {
    let prevMessages = this.state.prevMessages;
    let latestInterpretation = '';
    for (let i=prevMessages.length-1; i>=0; i--) {
      if (latestInterpretation === '' && prevMessages[i].type === 'interpreted') {
        latestInterpretation = prevMessages[i];
      }
    }
    if (prevMessages[index].checked === undefined && prevMessages[index].commenter === this.state.playerName && prevMessages[index] === latestInterpretation) {
      prevMessages[index].checked = true;
      let commenter = prevMessages[index].commenter;
      let mess = 'Was \'' + prevMessages[index].mess + '\' incorrect?';
      let date = new Date();
      let time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
      prevMessages.forEach((message, i) => {
        if (message.type === 'new interpretation') {
          prevMessages.splice(i, 1);
        }
      });
      const message = { commenter, time, mess, type: 'new interpretation' };
      prevMessages.splice(index+1, 0, message);
      this.setState({prevMessages});
    }
  }

  onNewInterpretationClick = (index, buttonType) => {
    let prevMessages = this.state.prevMessages;
    let reportOpen = false;
    prevMessages.splice(index, 1);
    if (buttonType === 'yes') {
      reportOpen = true;
    } else if (prevMessages[index-1].type === 'interpreted') {
      delete prevMessages[index-1].checked;
    }
    this.setState({prevMessages, reportIndex: index-1, reportOpen, reportedMessage: prevMessages[index-1]});
  }

  updatePlayerIcon = (iconName) => {
    if (this.state.setName) {
      this.socket.emit('updatePlayerIcon', iconName);
    }
  }

  render() {
    const board = this.state.board;
    let allPlayers = [];
    this.state.allPlayers.forEach((player, i) => {
      // let playerInfo = { name: player,
      //                    inventory: this.state.allPlayers[player].inventory,
      //                    ready: this.state.allPlayers[player].ready,
      //                    position: this.state.allPlayers[player].position,
      //                    hasLeftGame: this.state.allPlayers[player].hasLeftGame,
      //                    iconName: this.state.allPlayers[player].iconName
      //                  };
      allPlayers.push(<PlayerInfo
                        playerInfo={player}
                        allPlayersReady={this.state.allPlayersReady}
                        key={i}
                        className="row player-box"
                        hasSetName={this.state.setName}
                        yourName={this.state.playerName}
                      />);
    });

    // victory is a boolean retrieved from BE to indicate if game has been won, if true different map
    // if(victory){
    //   let gameInfo = <div className='game-info winner'>
    //                   <GameInfo
    //                     board={board}
    //                     allPlayersReady={this.state.allPlayersReady}
    //                     onHoverOverTile={this.onHoverOverTile}
    //                     timer={this.state.timer}
    //                   />
    //                  </div>;
    // } else {
      let gameInfo = <div className='game-info'>
                      <GameInfo
                        board={board}
                        allPlayersReady={this.state.allPlayersReady}
                        onHoverOverTile={this.onHoverOverTile}
                        timer={this.state.timer}
                      />
                     </div>;
    // }
    let playerInfo;
    if (this.state.allPlayersReady) {
      playerInfo = <div className='player-info'>
                      <div className="ui list">{allPlayers}</div>
                      <MultiButton type="abandon-button"/>
                   </div>;
    }
    else {
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
        <Navigation inGame={true} updatePlayerIcon={this.updatePlayerIcon}/>
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
            onMessageHover={this.onMessageHover}
            onMessageLeave={this.onMessageLeave}
            reportHover={this.state.reportHover}
            reportIndex={this.state.reportIndex}
            onInterpretedClick={this.onInterpretedClick}
            onNewInterpretationClick={this.onNewInterpretationClick}
          />
        </div>
        <ReportModal
          isOpen={this.state.reportOpen}
          message={this.state.reportedMessage}
          onToggle={this.onReportToggle}
        />
      </div>
    )
  }
}

export default Play;
