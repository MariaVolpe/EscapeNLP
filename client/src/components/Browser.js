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

    this.socket = socketIOClient('http://localhost:8000');

    this.socket.on('refreshRoomsReceived', (allRooms) => {
      const lobbies = allRooms.map(({ gameName, gameId }) => {
        return (
          <div className="five wide column">
            <Lobby
              lobbyName={gameName}
              lobbyId={gameId}
              className="lobby-box"
              onLobbyClick={this.onLobbyClick}
            />
          </div>
        );
      });
      this.setState({lobbies});
    });

    this.onCreateClick = this.onCreateClick.bind(this);
    this.handleCreateSubmit = this.handleCreateSubmit.bind(this);
  }

  componentDidMount = () => {
    this.socket.emit('getAllRooms');
  }

  onLobbyClick = (event) => {
    console.log("clicked on lobby");
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
          window.location.replace('/play');
        });
      });
  }

  render() {
    return (
      <div style={{background: '#283942', height: '100vh'}}>
        <Navigation />

        <h1 style={{textAlign: "center", marginTop: '3%', color: 'white'}}>Current Lobbies</h1>

        <div className="ui grid" style={{marginTop: '3%', marginLeft: '3%', width: '100%'}}>
          {this.state.lobbies}
        </div>
        <CreateLobbyModal isOpen={this.state.createLobbyIsOpen} onToggle={this.onCreateClick} handleSubmit={this.handleCreateSubmit}/>
        <Button
          onClick={this.onCreateClick}
          color="success"
          style={{marginTop: '3%'}}
        >
          <i class="plus icon"></i> Create Lobby
        </Button>
        <br /><br /><br /><br /><br /><br />
      </div>
    );
  }
}

export default Browser;
