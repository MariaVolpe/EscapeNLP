import React, { Component } from 'react';
import Lobby from './Lobby';
import Navigation from './Navigation';
import '../styles/Browser.css';

class Browser extends Component {

  onLobbyClick = (event) => {
    console.log("clicked on lobby");
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
        </div>

      </div>
    );
  }
}

export default Browser;
