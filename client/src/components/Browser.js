import React, { Component } from 'react';
import Lobby from './Lobby';
import Navigation from './Navigation';
import CreateLobbyModal from './CreateLobbyModal';
import { Button } from 'reactstrap';
// import '../styles/Browser.css';

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
      <div style={{background: '#283942', height: '100vh'}}>
        <Navigation />

        <h1 style={{textAlign: "center", marginTop: '3%', color: 'white'}}>Current Lobbies</h1>

        <div className="ui grid" style={{marginTop: '3%', marginLeft: '3%', width: '100%'}}>
          <div className="five wide column">
            <Lobby lobbyName="puzzle solvers" playerCount={4} className="lobby-box" onLobbyClick={this.onLobbyClick}/>
          </div>
          <div className="five wide column">
            <Lobby lobbyName="new people only" playerCount={5} className="lobby-box" onLobbyClick={this.onLobbyClick}/>
          </div>
          <div className="five wide column">
            <Lobby lobbyName="new people only" playerCount={5} className="lobby-box" onLobbyClick={this.onLobbyClick}/>
          </div>
          <div className="five wide column">
            <Lobby lobbyName="new people only" playerCount={5} className="lobby-box" onLobbyClick={this.onLobbyClick}/>
          </div>
          <div className="five wide column">
            <Lobby lobbyName="new people only" playerCount={5} className="lobby-box" onLobbyClick={this.onLobbyClick}/>
          </div>
          <div className="five wide column">
            <Lobby lobbyName="new people only" playerCount={5} className="lobby-box" onLobbyClick={this.onLobbyClick}/>
          </div>
          <div className="five wide column">
            <Lobby lobbyName="new people only" playerCount={5} className="lobby-box" onLobbyClick={this.onLobbyClick}/>
          </div>
          <div className="five wide column">
            <Lobby lobbyName="new people only" playerCount={5} className="lobby-box" onLobbyClick={this.onLobbyClick}/>
          </div>
          <div className="five wide column">
            <Lobby lobbyName="new people only" playerCount={5} className="lobby-box" onLobbyClick={this.onLobbyClick}/>
          </div>
          <div className="five wide column">
            <Lobby lobbyName="new people only" playerCount={5} className="lobby-box" onLobbyClick={this.onLobbyClick}/>
          </div>
          <div className="five wide column">
            <Lobby lobbyName="new people only" playerCount={5} className="lobby-box" onLobbyClick={this.onLobbyClick}/>
          </div>
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
