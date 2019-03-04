import React, { Component } from 'react';
import { Input } from 'reactstrap';
import './TextInfo.css';

class TextInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      prevMessages: []
    }
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onKeyPress = (event) => {
    if (event.key === 'Enter') {
      const message = event.target.value;
      let prevMessages = this.state.prevMessages;
      prevMessages.push(message);
      this.setState({message: '', prevMessages});
    }
  }

  onChange = (event) => {
    const message = event.target.value;
    this.setState({message});
  }

  render() {

    let prevMessages = this.state.prevMessages.map((message, i) =>
      <div key={i}>
        <a>{message}</a>
      </div>
    );

    return(
      <div>
        <div>{prevMessages}</div>
        <div>
          <Input
            value={this.state.message}
            onChange={this.onChange}
            onKeyPress={this.onKeyPress}
          />
        </div>
      </div>
    )
  }
}

export default TextInfo;
