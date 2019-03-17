import React, { Component } from 'react';
import { Button } from 'reactstrap';
import ConfirmModal from './ConfirmModal';
import '../styles/MultiButton.css';

class MultiButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      confirmInfo: {
        title: "Abandon Game?",
        text: "Do you really want to abandon your teammates?",
        confirm: "Abandon",
        cancel: "Cancel"
      }
    };

    this.onToggle = this.onToggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onToggle = (event) => {
    //console.log('You abandoned your teammates!');
    //window.location.replace('/');
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  handleSubmit = (event) => {
    console.log('You abandoned your teammates!');
    window.location.replace('/');
    event.preventDefault();
  }

  render() {

    let buttonType = this.props.type;
    let buttonName = "Button";
    let buttonUsage;

    if (buttonType === "abandon-button") {
      buttonUsage = <div>
                      <ConfirmModal isOpen={this.state.isOpen} onToggle={this.onToggle} handleSubmit={this.handleSubmit} confirmInfo={this.state.confirmInfo}/>
                      <Button onClick={this.onToggle} className={this.props.type}>Abandon</Button>
                    </div>;
    }
    else if (buttonType === "ready-button") {
      buttonUsage = <div>
                      <Button onClick={this.props.readyUp} className={this.props.type}>Ready</Button>
                    </div>;
    }
    else if (buttonType === "leave-button") {
      buttonUsage = <div>
                      <ConfirmModal isOpen={this.state.isOpen} onToggle={this.onToggle} handleSubmit={this.handleSubmit} confirmInfo={this.state.confirmInfo}/>
                      <Button onClick={this.onToggle} className={this.props.type}>Leave</Button>
                    </div>;
    }

    return(
      <div>
        {buttonUsage}
      </div>
    )
  }
}

export default MultiButton;
