import React, { Component } from 'react';
import Lobby from './Lobby';
import Navigation from './Navigation';
import CreateLobbyModal from './CreateLobbyModal';
import { Button } from 'reactstrap';
import '../styles/Browser.css';

class Browser extends Component {
  constructor(props){
    super(props);
    this.state = {
      createLobbyIsOpen: false
    }

    this.onCreateClick = this.onCreateClick.bind(this);
    this.handleCreateSubmit = this.handleCreateSubmit.bind(this);
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
    window.location.replace('/play');
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <Navigation />

        <div className="middle">
          <div clasName="lobby-browser">
            <Lobby lobbyName="puzzle solvers" playerCount={4} className="lobby-box" onLobbyClick={this.onLobbyClick}/>
            <Lobby lobbyName="new people only" playerCount={5} className="lobby-box" onLobbyClick={this.onLobbyClick}/>
            <Lobby lobbyName="new people only" playerCount={5} className="lobby-box" onLobbyClick={this.onLobbyClick}/>
            <Lobby lobbyName="new people only" playerCount={5} className="lobby-box" onLobbyClick={this.onLobbyClick}/>
            <Lobby lobbyName="new people only" playerCount={5} className="lobby-box" onLobbyClick={this.onLobbyClick}/>
            <Lobby lobbyName="new people only" playerCount={5} className="lobby-box" onLobbyClick={this.onLobbyClick}/>
            <Lobby lobbyName="new people only" playerCount={5} className="lobby-box" onLobbyClick={this.onLobbyClick}/>
            <Lobby lobbyName="new people only" playerCount={5} className="lobby-box" onLobbyClick={this.onLobbyClick}/>
            <Lobby lobbyName="new people only" playerCount={5} className="lobby-box" onLobbyClick={this.onLobbyClick}/>
            <Lobby lobbyName="new people only" playerCount={5} className="lobby-box" onLobbyClick={this.onLobbyClick}/>
            <Lobby lobbyName="new people only" playerCount={5} className="lobby-box" onLobbyClick={this.onLobbyClick}/>
          </div>
          <CreateLobbyModal isOpen={this.state.createLobbyIsOpen} onToggle={this.onCreateClick} handleSubmit={this.handleCreateSubmit}/>
          <Button onClick={this.onCreateClick}>Create Lobby</Button>
        </div>
      </div>
    );
  }
}

export default Browser;
