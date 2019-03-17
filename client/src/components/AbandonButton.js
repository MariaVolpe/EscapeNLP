import React, { Component } from 'react';
import { Button } from 'reactstrap';
import AbandonModal from './AbandonModal';
import '../styles/AbandonButton.css';

class AbandonButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };

    this.onToggle = this.onToggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onToggle = (event) => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  handleSubmit = (event) => {
    console.log('You abandoned your teammates!');
    window.location.replace('/');
    event.preventDefault();
  }

  render() {
    return(
      <div>
        <AbandonModal
          isOpen={this.state.isOpen}
          onToggle={this.onToggle}
          handleSubmit={this.handleSubmit}
        />
        <Button onClick={this.onToggle} className="abandon-button">Abandon</Button>
      </div>
    )
  }
}

export default AbandonButton;
