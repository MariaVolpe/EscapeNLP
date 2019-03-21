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
      playerInfo: {
        name: 'Nicky Cen',
        inventory: {
          key: 'doorKey',
          weapon: 'sword',
        },
        picture: '[pic]',
      },
      allPlayers: [],
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
      const message = 'You said: `' + event.target.value + '`';
      let prevMessages = this.state.prevMessages;
      prevMessages.push(message);
      this.setState({ message: '', prevMessages });
    }
  }

  onMessageChange = (event) => {
    const message = event.target.value;
    if (message.length <= 50) {
      this.setState({ message });
    }
  }

  onCommandKeyPress = (event) => {
    if (event.key === 'Enter' && event.target.value.length > 0) {
      const message = 'You wanted to: `' + event.target.value + '`';
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
    this.setState({ allPlayersReady: !this.state.allPlayersReady });
  }

  onNameSubmit = (event) => {
    const playerName = this.state.playerName;
    if (playerName.length > 0) {
      let playerInfo = this.state.playerInfo;
      playerInfo["name"] = playerName;
      let allPlayers = this.state.allPlayers;
      allPlayers.push(<PlayerInfo playerInfo={this.state.playerInfo} style={"player-box2"} />);
      this.setState({allPlayers, playerInfo, setName: !this.state.setName});
    }
    event.preventDefault();
  }

  onNameChange = (event) => {
    const playerName = event.target.value;
    if (playerName.length > 0 && playerName.length < 25) {
      this.setState({playerName});
    }
  }

  componentDidMount = () => {
    let allPlayers = [];
    let evenOrOdd = "";

    for (let i=0; i<5; i++) {
      if (i%2 === 1) {
        evenOrOdd = "2";
      }
      else {
        evenOrOdd = "";
      }
      allPlayers.push(<PlayerInfo playerInfo={this.state.playerInfo} style={"player-box" + evenOrOdd} />)
    }
    this.setState({allPlayers});
  }

  render() {
    const map = new Array(12).fill(0).map(() => new Array(12).fill(0));
    const allPlayers = this.state.allPlayers;
    console.log(allPlayers);

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
                      {allPlayers}
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
                    {allPlayers}
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

    const setName = this.state.setName;

    return(
      <div className="play-page" >
        {playerInfo}
        {gameInfo}
        <CreateNameModal isOpen={!this.state.setName} handleSubmit={this.onNameSubmit} value={this.state.playerName} onNameChange={this.onNameChange}/>
        <div className='text-info'>
          text and stuff
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
