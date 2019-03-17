import React, { Component } from 'react';
<<<<<<< HEAD:client/src/Browser.js
import Lobby from './Lobby.js';
import './Browser.css';
=======
import '../styles/Browser.css';
>>>>>>> d5483488e454366dc1bbd43eeb8b4966562f39ea:client/src/components/Browser.js

class Browser extends Component {

  onLobbyClick = (event) => {
    console.log("clicked on lobby");
  }

  render() {
    return (
      <div>
        <div className="filter-group">
          some filters, have to wait for backend
        </div>
        <div className="middle">
          <div clasName="lobby-browser">
            <Lobby lobbyName="puzzle solvers" playerCount={4} className="lobby-box" onLobbyClick={this.onLobbyClick}/>
            <Lobby lobbyName="new people only" playerCount={5} className="lobby-box" onLobbyClick={this.onLobbyClick}/>
          </div>
        </div>
        <div className="right-side">
          right side stuff
        </div>
      </div>
    );
  }
}

export default Browser;
