import React, { Component } from 'react';
import { Row, Col, Button } from 'reactstrap';
import socketIOClient from 'socket.io-client';
import ErrorModal from './ErrorModal';
import ConfirmModal from './ConfirmModal';
import '../styles/Lobby.css';

const axios = require('axios');

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorOpen: false,
      confirmOpen: false,
      roomSize: 0
    }
    this.confirmInfo = {
      title: 'Join Game?',
      text: 'Do you want to join the lobby?',
      confirm: 'Join',
      cancel: 'Cancel',
    };
    this.socket = socketIOClient('http://localhost:8000');

    this.socket.on('canJoin', (isJoinable) => {
      if (isJoinable === true) {
        console.log('Join a room');
        //window.location.replace('/play');
        axios.post('/game/0/player')
          .then((res) => {
            console.log(res);
          });
        this.setState({ confirmOpen: !this.state.confirmOpen });
      }
      else {
        this.setState({ errorOpen: !this.state.errorOpen });
      }
    });

    this.socket.on('secondCanJoin', (isJoinable) => {
      if (isJoinable) {
        window.sessionStorage.setItem('roomId', this.props.lobbyName);
        window.location.replace('/play');
      }
      else {
        this.setState({ confirmOpen: !this.state.confirmOpen, errorOpen: !this.state.errorOpen });
      }
    });

    this.socket.on('checkRoomSize', (roomSize) => {
      this.setState({roomSize});
    });

  }

  componentDidMount = () => {
    this.socket.emit('checkRoomSize', (this.props.lobbyName));
    this.socket.emit('lobbyBrowser');
  }

  onJoinClick = (event) => {
    this.socket.emit('canJoin', this.props.lobbyName);
  }

  onErrorSubmit = (event) => {
    this.setState({ errorOpen: !this.state.errorOpen});
    event.preventDefault();
  }

  onConfirmSubmit = (event) => {
    this.socket.emit('secondCanJoin', this.props.lobbyName);
    event.preventDefault();
  }

  onConfirmToggle = (event) => {
    this.setState({ confirmOpen: !this.state.confirmOpen });
  }

  render() {

    return (
      <div className={this.props.className}>
      <a onClick={this.props.onLobbyClick}>
        <Row>
          <Col>
            {this.props.lobbyName}
          </Col>
          <Col>
            <ErrorModal isOpen={this.state.errorOpen} handleSubmit={this.onErrorSubmit}/>
            <ConfirmModal
              isOpen={this.state.confirmOpen}
              handleSubmit={this.onConfirmSubmit}
              onToggle={this.onConfirmToggle}
              confirmInfo={this.confirmInfo}
            />
            <Button onClick={this.onJoinClick} color="success">Join</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            Lobby Info
          </Col>
          <Col>
            Player Count: {this.state.roomSize}/5
          </Col>
        </Row>
      </a>
      </div>
    );
  }
}

export default Lobby;
