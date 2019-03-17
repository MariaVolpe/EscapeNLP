import React, { Component } from 'react';
import { Row, Col, Button } from 'reactstrap';
import ErrorModal from './ErrorModal';
import ConfirmModal from './ConfirmModal';
import '../styles/Lobby.css';

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorOpen: false,
      confirmOpen: false,
    }
    this.confirmInfo = {
      title: 'Join Game?',
      text: 'Do you want to join the lobby?',
      confirm: 'Join',
      cancel: 'Cancel',
    };
  }

  onJoinClick = (event) => {
    if (this.props.playerCount < 5) {
      console.log('Join a room');
      //window.location.replace('/play');
      this.setState({ confirmOpen: !this.state.confirmOpen });
    }
    else {
      this.setState({ errorOpen: !this.state.errorOpen });
    }
  }

  onErrorSubmit = (event) => {
    this.setState({ errorOpen: !this.state.errorOpen});
    event.preventDefault();
  }

  onConfirmSubmit = (event) => {
    window.location.replace('/play');
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
            <Button onClick={this.onJoinClick}>Join</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            Lobby Info
          </Col>
          <Col>
            Player Count: {this.props.playerCount}/5
          </Col>
        </Row>
      </a>
      </div>
    );
  }
}

export default Lobby;
