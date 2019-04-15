import React, { Component } from 'react';
import { Row, Col, Button } from 'reactstrap';
import socketIOClient from 'socket.io-client';
import ErrorModal from './ErrorModal';
import ConfirmModal from './ConfirmModal';
import axios from 'axios';
import '../styles/Lobby.css';

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorOpen: false,
      confirmOpen: false,
      roomSize: 0,
    }
    this.confirmInfo = {
      title: 'Join Game?',
      text: 'Do you want to join the lobby?',
      confirm: 'Join',
      cancel: 'Cancel',
    };
    this.socket = socketIOClient('');

    this.socket.on('canJoin', (isJoinable) => {     
      if (isJoinable) {
        this.setState({ confirmOpen: true });
      } else {
        this.setState({ errorOpen: true });
      }
    });

    this.socket.on('confirmJoin', (isJoinable) => {
      if (isJoinable) {
        window.sessionStorage.setItem('roomName', this.props.lobbyName);
        window.sessionStorage.setItem('roomId', this.props.lobbyId);        
        window.location.replace('/play');

        axios.post(`/game/${this.props.lobbyId}/player`);
      } else {
        this.setState({
          confirmOpen: !this.state.confirmOpen,
          errorOpen: !this.state.errorOpen,
        });
      }
    });

    this.socket.on('checkRoomSize', (roomSize) => {
      this.setState({roomSize});
    });

  }

  componentDidMount = () => {
    this.socket.emit('checkRoomSize', this.props.lobbyId);
    this.socket.emit('lobbyBrowser');
  }

  onJoinClick = (event) => {
    this.socket.emit('attemptJoin', this.props.lobbyId);
  }

  onErrorSubmit = (event) => {
    this.setState({ errorOpen: !this.state.errorOpen});
    event.preventDefault();
  }

  onConfirmSubmit = (event) => {
    this.socket.emit('confirmJoin', this.props.lobbyId);
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
