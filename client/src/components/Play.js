import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
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
        name: 'Nicky Ken',
        inventory: {
          key: 'doorKey',
          itm: 'sword',
          crd: 'doorKey',
          bk: 'sword'
        },
        picture: '[pic]',
        ready: true
      },
      playerTwoInfo: {
        name: 'Brian Camper',
        inventory: {
          key: 'doorKey',
          itm: 'sword',
          crd: 'doorKey'
        },
        picture: '[pic]',
        ready: true
      },
      playerThreeInfo: {
        name: 'Ismail Clear',
        inventory: {
          key: 'doorKey',
          itm: 'sword',
        },
        picture: '[pic]',
        ready: true
      },
      playerFourInfo: {
        name: 'John Green',
        inventory: {
          key: 'doorKey',
          itm: 'sword',
        },
        picture: '[pic]',
        ready: true
      },
      playerFiveInfo: {
        name: '',
        inventory: {
          key: 'doorKey',
          wep: 'sword',
        },
        picture: '[pic]',
        ready: false
      },
      map: [],
      message: '',
      prevMessages: [["Nicky Ken", new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(), "Let's solve a puzzle"],
                     ["guy", new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(), "There is no puzzle"]
                    ],
      command: '',
      allPlayersReady: false,
      setName: false,
      playerName: '',
      chatOption: '0',
      warningOpen: false
    }

    this.onMessageKeyPress = this.onMessageKeyPress.bind(this);
    this.onMessageChange = this.onMessageChange.bind(this);
    this.onCommandKeyPress = this.onCommandKeyPress.bind(this);
    this.onCommandChange = this.onCommandChange.bind(this);
    this.readyUp = this.readyUp.bind(this);
  }

  onMessageKeyPress = (event) => {
    if (event.key === 'Enter' && event.target.value.length > 0) {
      let commenter = this.state.playerName;
      let date = new Date();
      let time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
      let mess = event.target.value;
      const message = [commenter, time, mess, 0];
      let prevMessages = this.state.prevMessages;
      prevMessages.push(message);
      this.setState({ message: '', prevMessages });
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
      const message = [commenter, time, mess, 1];
      let prevMessages = this.state.prevMessages;
      prevMessages.push(message);
      this.setState({ command: '', prevMessages });
    }
  }

  onCommandChange = (event) => {
    const command = event.target.value;
    this.setState({ command });
  }

  readyUp = (event) => {
    let playerFiveInfo = this.state.playerFiveInfo;
    playerFiveInfo.ready = true;
    let playerOneInfo = this.state.playerOneInfo;
    let playerTwoInfo = this.state.playerTwoInfo;
    let playerThreeInfo = this.state.playerThreeInfo;
    let playerFourInfo = this.state.playerFourInfo;
    let allPlayersReady = playerOneInfo.ready && playerTwoInfo.ready && playerThreeInfo.ready && playerFourInfo.ready && playerFiveInfo.ready;
    this.setState({ allPlayersReady, playerFiveInfo});
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
      let playerFiveInfo = this.state.playerFiveInfo;
      playerFiveInfo["name"] = playerName;
      //let allPlayers = this.state.allPlayers;
      //allPlayers.push(<PlayerInfo playerInfo={this.state.playerInfo} style={"player-box2"} />);
      this.setState({playerFiveInfo, setName: !this.state.setName});
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
    allPlayers.push(<PlayerInfo playerInfo={this.state.playerOneInfo} style={"player-box"} className="row player-box" />);
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
