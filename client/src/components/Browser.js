import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import Lobby from './Lobby';
import Navigation from './Navigation';
import CreateLobbyModal from './CreateLobbyModal';
import { Button } from 'reactstrap';
import axios from 'axios';

// import '../styles/Browser.css';

class Browser extends Component {
  constructor(props){
    super(props);
    this.state = {
      createLobbyIsOpen: false,
      lobbies: []
    }

    this.socket = socketIOClient('http://localhost:8000');

    this.socket.on('getAllRooms', (allRooms) => {
      let lobbies = [];
      for (let i=0; i<allRooms.length; i++) {
        console.log(allRooms[i].gameName, ' ', allRooms[i]);
        lobbies.push( <div className="five wide column">
                        <Lobby lobbyName={allRooms[i].gameName} lobbyId={allRooms[i].gameId} className="lobby-box" onLobbyClick={this.onLobbyClick}/>
                      </div>);
      }
      this.setState({lobbies});
    })

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
    console.log('Create a room');
    this.setState({createLobbyIsOpen: !this.state.createLobbyIsOpen});
    event.preventDefault();
    //window.location.replace('/play');
  }

  handleCreateSubmit = (event) => {
    //console.log(event.target[0].value);
    event.preventDefault();
    const name = event.target[0].value;
    window.sessionStorage.setItem('roomName', name);

    axios.post('/game', { gameName: name }).then(res => {
      console.log(res);
      window.sessionStorage.setItem('roomId', res.data.gameId);
      window.location.replace('/play');
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
