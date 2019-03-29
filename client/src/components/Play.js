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
        name: 'Nicky Cen',
        inventory: {
          key: 'doorKey',
          weapon: 'sword',
        },
        picture: '[pic]',
        ready: true
      },
      playerTwoInfo: {
        name: 'Nicky Cen',
        inventory: {
          key: 'doorKey',
          weapon: 'sword',
        },
        picture: '[pic]',
        ready: true
      },
      playerThreeInfo: {
        name: 'Nicky Cen',
        inventory: {
          key: 'doorKey',
          weapon: 'sword',
        },
        picture: '[pic]',
        ready: true
      },
      playerFourInfo: {
        name: 'Nicky Cen',
        inventory: {
          key: 'doorKey',
          weapon: 'sword',
        },
        picture: '[pic]',
        ready: true
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
      playerName: ""
    }

    this.onMessageKeyPress = this.onMessageKeyPress.bind(this);
    this.onMessageChange = this.onMessageChange.bind(this);
    this.onCommandKeyPress = this.onCommandKeyPress.bind(this);
    this.onCommandChange = this.onCommandChange.bind(this);
    this.readyUp = this.readyUp.bind(this);
  }

  onMessageKeyPress = (event) => {
    if (event.key === 'Enter') {
      let date = new Date();
      const message = ' (' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ') You said: `' + event.target.value + '`';
      let prevMessages = this.state.prevMessages;
      prevMessages.push(message);
      this.setState({ message: '', prevMessages });
    }
  }

  onMessageChange = (event) => {
    const message = event.target.value;
    if (message.length <= 25) {
      this.setState({ message });
    }
  }

  onCommandKeyPress = (event) => {
    if (event.key === 'Enter' && event.target.value.length > 0) {
      let date = new Date();
      const message = '(' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ') You wanted to: `' + event.target.value + '`';
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
    this.setState({ allPlayersReady: (playerOneInfo.ready && playerTwoInfo.ready && playerThreeInfo.ready && playerFourInfo.ready && playerFiveInfo.ready), playerFiveInfo});
  }

  onNameSubmit = (event) => {
    const playerName = this.state.playerName;
    if (playerName.length > 2) {
      let playerFiveInfo = this.state.playerFiveInfo;
      playerFiveInfo["name"] = playerName;
      //let allPlayers = this.state.allPlayers;
      //allPlayers.push(<PlayerInfo playerInfo={this.state.playerInfo} style={"player-box2"} />);
      this.setState({playerFiveInfo, setName: !this.state.setName});
    }
    event.preventDefault();
  }

  onNameChange = (event) => {
    const playerName = event.target.value;
    if (playerName.length > 0 && playerName.length < 25) {
      this.setState({playerName});
    }
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
                    <Commands command={this.state.command} onKeyPress={this.onCommandKeyPress} onChange={this.onCommandChange} className="command-box" />
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
        <CreateNameModal isOpen={!this.state.setName} handleSubmit={this.onNameSubmit} value={this.state.playerName} onNameChange={this.onNameChange}/>
        <div className='text-info'>
          <TextInfo
            message={this.state.message}
            prevMessages={this.state.prevMessages}
            onKeyPress={this.onMessageKeyPress}
            onChange={this.onMessageChange}
          />
        </div>
      </div>
    )
  }
}

export default Play;
