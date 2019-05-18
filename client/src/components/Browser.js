import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import Lobby from './Lobby';
import Navigation from './Navigation';
import CreateLobbyModal from './CreateLobbyModal';
import { Button } from 'reactstrap';
import axios from 'axios';

class Browser extends Component {
  constructor(props){
    super(props);
    this.state = {
      createLobbyIsOpen: false,
      lobbies: [],
    }

    this.socket = socketIOClient('');

    this.socket.on('refreshRoomsReceived', (allRooms) => {
      const lobbies = allRooms.map(({ gameName, gameId, inProgress}) => {
        if(inProgress === false){
          return (
            <div className="five wide column" key={gameId}>
              <Lobby
                lobbyName={gameName}
                lobbyId={gameId}
                className="lobby-box"
                onLobbyClick={this.onLobbyClick}
              />
            </div>
          );
        }
      });
      this.setState({lobbies});
    });

    this.onCreateClick = this.onCreateClick.bind(this);
    this.handleCreateSubmit = this.handleCreateSubmit.bind(this);
  }

  componentDidMount = () => {
    this.socket.emit('getAllRooms');
  }

  onCreateClick = (event) => {
    this.setState({createLobbyIsOpen: !this.state.createLobbyIsOpen});
    event.preventDefault();
  }

  handleCreateSubmit = (event) => {
    event.preventDefault();
    const name = event.target[0].value;
    window.sessionStorage.setItem('roomName', name);

    axios.post('/game', { gameName: name })
      .then(res => {
        const id = res.data.data.gameId;
        window.sessionStorage.setItem('roomId', id);
        axios.post(`/game/${id}/player`).then(res => {
          const playerId = res.data.data.playerId;
          window.sessionStorage.setItem('playerId', playerId);
          window.location.replace('/play');
        });
      });
  }

  render() {
    return (
      <div className="browser-background">
        <Navigation inGame={false} />

        <h1 className="lobby-title">Current Lobbies</h1>

        <div className="ui grid" style={{marginTop: '3%', marginLeft: '3%', width: '100%'}}>
          {this.state.lobbies}
        </div>
        <CreateLobbyModal
          isOpen={this.state.createLobbyIsOpen}
          onToggle={this.onCreateClick}
          handleSubmit={this.handleCreateSubmit}
        />
        <Button
          onClick={this.onCreateClick}
          color="success"
          className="lobby-create"
        >
          <i className="plus icon"></i> Create Lobby
        </Button>
      </div>
    );
  }
}

export default Browser;
