import React, { Component } from 'react';
import { Button } from 'reactstrap';
import '../styles/Home.css';

class Home extends Component {

  constructor(props) {
    super(props);

    this.onPlayClick = this.onPlayClick.bind(this);
    this.onHowToClick = this.onHowToClick.bind(this);
  }

  onPlayClick = (event) => {
    window.location.replace('/browser');
  }

  onHowToClick = (event) => {
    window.location.replace('/howto');
  }

  render() {
    return(
      <div className="App-header">
        <h1>EscapeNLP</h1>
        <div className="buttons">
          <Button
            onClick={this.onPlayClick}
            color="danger"
            className="button"
          >
            Find Game
          </Button>
          <div className="center-buttons">
            <Button
              onClick={this.onHowToClick}
              color="danger"
              className="button"
            >
              About
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
